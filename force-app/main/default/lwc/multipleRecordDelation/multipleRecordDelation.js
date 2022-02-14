import { LightningElement, wire ,api,track} from 'lwc';
import displayAccounts from '@salesforce/apex/AccountControllerDel.displayAccounts';
import delAccRecord from '@salesforce/apex/AccountControllerDel.delAccRecord';
import getAccounts from '@salesforce/apex/AccountControllerDel.searchAccountNameMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import selectOption from '@salesforce/apex/AccountControllerDel.selectedOption';
import { refreshApex } from '@salesforce/apex';

//import searchAccountNameMethod from '@salesforce/apex/AccountControllerDel.searchAccountNameMethod';

const DELAY = 100;
let i=0;
export default class MultipleRecordDelation extends LightningElement {

    @api recordId;
   // @track columns = columns;
    @track currentRecordId;

    @api selectedContactIdList=[];//for combobox

    selectedValue;//for combobox

    @track error;

    recordTypeId;
    isModalOpen = false;
    modalAccountId;
    accountName = '';
    accountPhone = '';
    @api selectedRecords=[];
    @api errorMessage;
    @track buttonLabel ='Delete Selected Account';
    

    @api columns = [
        { label: 'Id', fieldName: 'Id' },  
        { label: 'Name', fieldName: 'Name' },
        { label: 'Industry', fieldName: 'Industry'},
        { label: 'Website', fieldName: 'Website'},
       { label: 'AnnualRevenue', fieldName: 'AnnualRevenue'},
       {type: "button", typeAttributes: {  
        label: 'Edit',  
        name: 'Edit',  
        title: 'Edit',  
        disabled: false,  
        value: 'edit',  
        iconPosition: 'left'
        
    }}
    ];

   @wire(getAccounts,{
        accStrName:'$accountName',
        accStrPhone:'$accountPhone'
    })accounts;


    //@wire(getAccounts)
    wiredAccounts({ error, data}) {
    if(data){
        this.items = data;
        console.log('display item'+ this.items);
        this.totalRecountCount = data.length; //here it is 23
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
        console.log('Display total count ...........' + this.totalRecountCount)
        //initial data to be displayed ----------->
        //slice will take 0th element and ends with 5, but it doesn't include 5th element
        //so 0 to 4th rows will be displayed in the table
        this.data = this.items.slice(0,this.pageSize); 
        this.endingRecord = this.pageSize;
        this.columns = columns;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.data = undefined;
    }
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
    /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
    page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
    so, slice(5,10) will give 5th to 9th records.
    */
    this.startingRecord = ((page -1) * this.pageSize) ;
    this.endingRecord = (this.pageSize * page);

    this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                        ? this.totalRecountCount : this.endingRecord; 

    this.data = this.items.slice(this.startingRecord, this.endingRecord);

    //increment by 1 to display the startingRecord count, 
    //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
    this.startingRecord = this.startingRecord + 1;
    
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
            return refreshApex(this.accounts);
           
   
           
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
  
    searchAccountAction(event){
        //this.accountName = event.target.value;
        const searchString = event.target.value;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
        this.accountName  = searchString; 
        }, DELAY);
    }

    handleEdit = (event) =>{
      // this.modalAccountId = event.target.Id; 
       this.modalAccountId = event.detail.row;
      console.log('display account id..............'+this.modalAccountId );
      this.isModalOpen = true;
      this.editCurrentRecord(modalAccountId);

    }

    handleModalClose = (event) =>{
        this.isModalOpen = false;
    }


    //value = 'Select Value';
    /*get options() {
        let recordSizeList = [];
        recordSizeList.push({'label':'5', 'value':'5'});
        recordSizeList.push({'label':'10', 'value':'10'});
        recordSizeList.push({'label':'20', 'value':'20'});
        recordSizeList.push({'label':'25', 'value':'25'});
        return recordSizeList;
    }*/
    
    get options() {
        return [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '15', value: '15' },
            { label: '20', value: '20' },

        ];

    }

    /*handleChange(event) {
        this.selectedValue = event.detail.value;
        console.log('Selected value is : '+this.selectedValue);
        selectedOption({recordSize: this.selectedValue}) // calling the apex method for combobox

              .then(result => {
                  console.log("in success,",result);
                  this.accounts.data = result;
                  console.log('show the result value .....'+this.accounts.data);
                  this.error = undefined;   

              })

              .catch(error => {
                  this.error = error;
                  this.accounts.data = undefined;

              });    

      }*/
       
      handleChange(event) {

        this.selectedValue = event.detail.value;
        console.log('Selected value is : '+this.selectedValue);
        selectOption({recordSize: this.selectedValue}) // calling the apex method for combobox

              .then(result => {
                  console.log("in success,",result);
                  this.accounts.data = result;
                  console.log('Dispaly data:::'+this.accounts.data);
                  this.error = undefined;

              })

              .catch(error => {
                  this.error = error;
                  this.accounts.data = undefined;

              });

  

      }
       
        /*this.pageNumber = 1;
        this.totalPages = Math.ceil(this.totalRecords / Number(this.selectedValue));
        console.log('Display total page.....'+this.totalPages);
        this. accounts();*/
   
}