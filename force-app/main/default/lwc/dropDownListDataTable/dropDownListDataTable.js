import { LightningElement ,track,wire,api} from 'lwc';
import getAccountList from '@salesforce/apex/TestController.getAccountList';
import selectOption from '@salesforce/apex/TestController.selectedOption';
export default class DropDownListDataTable extends LightningElement {

    @api selectedContactIdList=[];//for combobox
    selectedValue;//for combobox

    @track columns = [{
        label: 'Account name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Type',
        fieldName: 'Type',
        type: 'text',
        sortable: true
    },
    {
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'Currency',
        sortable: true
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        sortable: true
    },
    {
        label: 'Website',
        fieldName: 'Website',
        type: 'url',
        sortable: true
    },
    {
        label: 'Rating',
        fieldName: 'Rating',
        type: 'test',
        sortable: true
    }
];

    @track error;
    @track accList ;
    @wire(getAccountList)
    wiredAccounts({error, data}) {

        if (data) {
            this.accList = data;
        } else if (error) {
            this.error = error;
        }
    }

    get options() {
        return [
            { label: '5',value: '5' },
            { label: '10',value: '10' },
            { label: '15',value: '15' },
            { label: '20',value: '20' },
         ];

    }

    handleChange(event) {
        this.selectedValue = event.detail.value;
        console.log('Selected value is : '+this.selectedValue);
        selectOption({recordSize:this.selectedValue}) // calling the apex method for combobox

              .then(result => {
                  console.log("in success,",result);
                  this.accList = result;
                  console.log('Dispaly data:::' +this.accList);
                  this.error = undefined;

              })
              .catch(error => {
                  this.error = error;
                  this.accList = undefined;
             });

      }

}