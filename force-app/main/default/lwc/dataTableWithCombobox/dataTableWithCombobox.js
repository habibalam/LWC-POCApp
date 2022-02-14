import { LightningElement, wire,track ,api} from 'lwc';
import selectOption from '@salesforce/apex/AccountsHelperController.selectedOption';
import getAccounts from '@salesforce/apex/AccountsHelperController.searchAccountNameMethod';
import delAccRecord from '@salesforce/apex/AccountsHelperController.delAccRecord';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const DELAY = 100;


const columns = [
    { label: 'Id', fieldName: 'Id',sortable: "true"},  
    { label: 'Name', fieldName: 'Name',sortable: "true" },
    { label: 'Industry', fieldName: 'Industry',sortable: "true"},
    { label: 'Website', fieldName: 'Website',sortable: "true"},
    { label: 'AnnualRevenue', fieldName: 'AnnualRevenue',sortable: "true"},
    {type: "button", typeAttributes: {  
    label: 'Edit',  
    name: 'Edit',  
    title: 'Edit',  
    disabled: false,  
    value: 'edit',  
    iconPosition: 'left' }}];

export default class DataTableWithCombobox extends LightningElement {
   
    @api selectedContactIdList=[];//for combobox
    selectedValue;//for combobox
    @track totalRecord;
    @track error;
    dataList;
    accountName = '';
    accountPhone = '';
    @api selectedRecords=[];
    

    recordTypeId;
    isModalOpen = false;
    @track modalAccountId;
    showSpinner = false;
    @track isTrue = false;

    @track recordsCount = 0;
    @track buttonLabel ='Delete Selected Account';
    @track dataList = []; //data to be displayed in the table


    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 5; 
    @track totalRecountCount = 0;
    @track totalPage = 0;
   
   

    @wire(getAccounts,{
        accStrName:'$accountName',
        accStrPhone:'$accountPhone'})
    //@wire(getAccounts)
    wireAccounts({error,data}){
        if(data){
           
            this.items=data;
          // this.dataList = data;
           this.totalRecord=data.length;
           this.totalRecountCount = data.length; 
           this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);  
           this.dataList = this.items.slice(0,this.pageSize); 
           this.endingRecord = this.pageSize;
           this.columns = columns; 
           this.error = undefined;
            console.log('Display value is: '+this.dataList);
        }else if(error){
            this.error=error;
            this.data=undefined;
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
                  this.showSpinner = true;
                  this.dataList = result;
                  console.log('Dispaly data:::'+this.dataList);
                  this.error = undefined;

              })
              .catch(error => {
                  this.error = error;
                  this.dataList = undefined;
             });

      }
   
      searchAccountAction(event){
        //this.accountName = event.target.value;
        const searchString = event.target.value;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
        this.accountName  = searchString; 
        }, DELAY);
    }
   
    getSelectedId(event){
        const selectedRows = event.detail.selectedRows;
        this.recordsCount = event.detail.selectedRows.length;
       // this.isTrue = true;
        for(let i=0; i< selectedRows.length; i++){
            this.selectedRecords.push(selectedRows[i].Id);
            console.log('@@@Selected records'+JSON.stringify(this.selectedRecords));

        }
        
    }

    handleDelete(event){ 
        this.isTrue = true;
        delAccRecord({
            acclist:this.selectedRecords      
           
        })
        .then(()=>{
            const vet = new ShowToastEvent({
                title: 'Delete Record.',
                message :this.recordsCount +'  Record is Deleted Successfully......',
                variant : 'success',
            });
            
            this.dispatchEvent(vet);
            this.isTrue = false;
            this.template.querySelector('lightning-datatable').selectedRows=[];
            this.recordsCount = 0;
            return refreshApex(this.dataList);
           
        }).catch(error => {
            const vet = new ShowToastEvent({
                title: 'Delete Record.',
                message :'You Cant Delete Record',
                variant : 'warning'
        
            });
            this.dispatchEvent(vet);
            console.log('im here');
           this.errorMessage=error;
           console.log('Error'+JSON.stringify(this.errorMessage));
        });
        
        this.isTrue = false;
    }

    handleEdit = (event) =>{
        //this.modalAccountId = event.target.Id; 
        //this.modalAccountId = event.target.value;
          this.modalAccountId = event.detail.row.Id;
          console.log('display account id..............' +this.modalAccountId );
          this.isModalOpen = true;
         
  
      }
  
      handleModalClose = (event) =>{
          this.isModalOpen = false;
          return refreshApex(this.dataList);
      }

      handleSortdata(event) {
        this.sortBy = event.detail.fieldName; // field name      
        this.sortDirection = event.detail.sortDirection;  // sort direction
        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.dataList));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
         // cheking reverse direction 
         let isReverse = direction === 'asc' ? 1: -1;

         // sorting data 
         parseData.sort((x, y) => {
             x = keyValue(x) ? keyValue(x) : ''; // handling null values
             y = keyValue(y) ? keyValue(y) : '';
 
             // sorting values based on direction
             return isReverse * ((x > y) - (y > x));
         });
 
         // set the sorted data to data table data
         this.dataList = parseData;
 
     }
    
     //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

     //this method displays records page by page
     displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.dataList = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
    

}