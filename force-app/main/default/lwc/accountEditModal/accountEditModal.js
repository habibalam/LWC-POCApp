import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { refreshApex } from '@salesforce/apex';
export default class AccountEditModal extends LightningElement {
    @api accId;
    dataList;
    showLoadingSpinner = false;
    renderedCallback(){
        console.log(JSON.stringify(this.accInfo));
        
    }

    closeModal = () =>{
        this.dispatchEvent(new CustomEvent("closemodal"));
        
    }

    handleSubmit = (event) =>{
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-form').submit(fields);
        
    }

    handleSuccess = (event) =>{
        console.log(JSON.stringify(event.detail));
        this.dispatchEvent(new ShowToastEvent({
            title: 'Account Updated',
            message: `Record updated Successfully`,
            variant: 'success',
            mode: 'sticky'
        }));
        
        this.closeModal();
        
    }

    handleError = (event) => {
        console.log(JSON.stringify(event.error));
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: 'Account Updated Failed',
            variant: 'destructive',
            mode: 'sticky'
        }));
    }
}