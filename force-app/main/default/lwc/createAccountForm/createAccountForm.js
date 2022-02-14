import { LightningElement,api,wire} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class CreateAccountForm extends LightningElement {

    name;
    phone;
    website;
    industry;
    options;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: INDUSTRY_FIELD })
    industryValues({ data, error })
    {
        if (data) {
            this.options = data.values;
        }
        else {
            console.log(JSON.stringify(error));
        }
    }

    handleChange = (event) =>
    {
        let inputName = event.target.name;
        let inputVal = event.detail.value;

        if (inputName === 'name') {
            this.name = inputVal;
        } else if (inputName === 'phone') {
            this.phone = inputVal;
        }else if (inputName === 'website') {
            this.website = inputVal
        } else if(inputName==='industry'){
            this.industry = inputVal;
        }
    }

    createAccount = () =>
    {
        const fields = { 'Name': this.name, 'Phone': this.phone, 'Website': this.website, 'Industry': this.industry };
        createRecord({ apiName: ACCOUNT_OBJECT.objectApiName, fields })
            .then(account =>
            {
                console.log(JSON.stringify(account));
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: `Account with id ${ account.id } created successfully`,
                    variant: 'success',
                    mode: 'sticky'
                }))
            })
            .catch(error =>
            {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: JSON.stringify(error),
                    variant: 'error',
                    mode: 'sticky'
                }))
            })
    }

    resetFormAction(event) {
        const lwcInputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (lwcInputFields) {
            lwcInputFields.forEach(field=> {
                field.reset();
            });
        }
     }

}