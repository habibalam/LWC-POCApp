import { LightningElement,track,wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccountList';
import getContacts from '@salesforce/apex/AccountController.getContactList';
import carouselImages from '@salesforce/resourceUrl/carServiceImage';
import { NavigationMixin } from 'lightning/navigation';

import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

import {deleteRecord} from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

import getBooks from '@salesforce/apex/AccountController.getBookDetails';


export default class PannelComponentSideBar extends NavigationMixin(LightningElement) {

    @track accountsList;
    @track contactsList;
    @track recordAccId;
    @track recordConId;
    @track  accountidfrmparent;
    @track cssClass = 'slds-col';
    @track booksList;
    @track recordBookId;
    @track selectedRecords=[];
    isCartbox = false;

    image1 = carouselImages + '/page-banner-66.jpeg';

    showAccounts = false;
    showContacts = false;
    showCompoent = false;
    showDependentPicklist = false;
    showModal = false;
    showTab = false;
   

    connectedCallback(){
        this.showAccounts = true;
        this.handleAccountRecords();
    }

    handleAccountRecords = () =>{
        this.showAccounts = true;
        this.showContacts = false;
        this.showCompoent = false;
        this.showTab = false;
        this.cssClass='slds-col center-div-class';
        getAccounts()
        .then(acc =>
            {
                this.accountsList = acc;
            })
        .catch(error => {
            console.log(JSON.stringify(error));
        })
    }

    handleContactRecords = () =>{
        this.showContacts = true;
        this.showAccounts = false;
        this. showCompoent = false;
        this. showDependentPicklist = false;
        this.template.querySelector('.centerDiv').classList.remove('center-div-class');
        getContacts()
        .then(con=>{
            this.contactsList = con;
            console.log("Display contact Records=>"+JSON.stringify(this.contactsList));
        })

        .catch(error => {
            console.log(JSON.stringify(error));
        })
        
    }
    navigateToReports = () =>
    {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Report',
                actionName: 'home'
            },
        });
    }

   
    handleDrageCompoent = ()=> {
        this.showCompoent = true;
        this.showContacts = false;
        this.showAccounts = false;
        this.showTab = false;
        this. showDependentPicklist = false;
        this.template.querySelector('.centerDiv').classList.remove('center-div-class');
        getAccounts()
        .then(acc =>
            {
                this.accountsList = acc;
                console.log("Display contact Records=>"+JSON.stringify(this.accountsLis));
            })
        .catch(error => {
            console.log(JSON.stringify(error));
        })     
    }
    
    handleDragStart(event){
        event.dataTransfer.setData("account_id", event.target.dataset.item);
    }

    handleClick(event){
        event.preventDefault();     
        this.accountidfrmparent = event.target.dataset.accountid;       
        console.log('account id '+this.accountidfrmparent)
    }
   
    

   
    @track controllingValues = [];
    @track dependentValues = [];
    @track selectedCountry;
    @track selectedState;
    @track isEmpty = false;
    @track error;
    controlValues;
    totalDependentValues = [];

 // Account object info
 @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
 objectInfo;

      // account object info
      @wire(getPicklistValuesByRecordType , {objectApiName:ACCOUNT_OBJECT,recordTypeId:'$objectInfo.data.defaultRecordTypeId'})
      countryPicklistValues({error,data}){
        if(data){
            this.error =null;
            let countryOptions = [{label:'--None--', value:'--None--'}];
            //account country controller filed value
            data.picklistFieldValues.Country__c.values.forEach(key =>{
                countryOptions.push({
                    label : key.label,
                    value:  key.value
                })
            });
            this.controllingValues = countryOptions;     


            let stateOptions = [{label:'--None--', value:'--None--'}];
            // Account State Control Field Picklist values
           this.controlValues = data.picklistFieldValues.State__c.controllerValues;
           // Account State dependent Field Picklist values
           this.totalDependentValues = data.picklistFieldValues.State__c.values;
           this.totalDependentValues.forEach(key => {
               stateOptions.push({
                   label : key.label,
                   value: key.value
               })
           });

           this.dependentValues = stateOptions;

        }else if(error){
            this.error = console.log(error);
        }
      }

      handleCountryChange(event) {
          this.selectedCountry = event.target.value;
          console.log('Display selected contry here :-' +this.selectedCountry);
          this.isEmpty = false;
          let dependValues = [];
          if(this.selectedCountry) {
            // if Selected country is none returns nothing
            if(this.selectedCountry === '--None--') {
                this.isEmpty = true;
                dependValues = [{label:'--None--', value:'--None--'}];
                this.selectedCountry = null;
                this.selectedState = null;
                return;
            }

            // filter the total dependent values based on selected country value 
            this.totalDependentValues.forEach(conValues => {
                if(conValues.validFor[0] === this.controlValues[this.selectedCountry]) {
                    dependValues.push({
                        label: conValues.label,
                        value: conValues.value
                    })
                }
            })

            this.dependentValues = dependValues;
        }
          
          
      }
    
      handleStateChange(event) {
        this.selectedState = event.target.value;
        console.log('Display selected State here :-' +this.selectedState );
    }
    HandleDependentPicklist =()=>{
        this. showDependentPicklist = true;
        this.showCompoent = false;
        this.showContacts = false;
        this.showAccounts = false;
        this.showTab = false;
        this.template.querySelector('.centerDiv').classList.remove('center-div-class');
    }

   // display contact record
    dataRow;
    @track accountRow={};
    @track rowOffset = 0;  
    @track modalContainer = false;
    isModalOpen = false;
    iscloseModal =false;
    previwHandler(event){
         //this.dataRow = event.detail.row;
         this.recordConId = event.target.dataset.recordId;
         this.accountRow = this.recordConId;
         console.log( 'Record Id is ' + JSON.stringify( this.recordConId ) );
         this.accountRow = this.dataRow;
         console.log('Previw details contact  :'+JSON.stringify(this.accountRow));
         this.isModalOpen=true;
    }
    closeModal(){
        this.isModalOpen =false;
    }

    // delete contact record
    @wire(getContacts)
    wirecontact(result){
    this.wireAccountsResult = result;
    }
    
    delHandler(event){
        this.recordConId = event.target.dataset.recordId;
        console.log('contact id '+ this.recordConId);
        deleteRecord(this.recordConId)
        .then(()=>{
               this.dispatchEvent(
                new ShowToastEvent({
                    titile:'Sucess',
                    message:'Record is delete successfully'+this.recordConId,
                    variant:'success'
                })
            );
            return refreshApex(this.contactsList);
        }).catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    titile:'Error',
                    message : error.body.message,
                    variant: 'error'
                })
            );
        })

    }
  

    handleTab(){
        this.showTab = true;
        this.showContacts = false;
        this.showAccounts = false;
        this. showCompoent = false;
        this. showDependentPicklist = false;
        this.template.querySelector('.centerDiv').classList.remove('center-div-class');
        
        getBooks()
         .then(result =>{
             this.booksList = result;
             console.log('Books Details  :' +this.booksList);
         }).catch(error =>{
             this.error=error;
         })
    }
    
    handleModalClose = () =>{
        this.isCartbox = false;    
    }
   @track count = 0;
   
    handleClickImg(event){
        event.preventDefault();  
         this.recordBookId = event.target.dataset.recordId;
         this.recordsCount = event.target.dataset.recordId;
         this.name = event.target.value;
         console.log('name='+this.name);
         //this.isCartbox = true;
         this.dispatchEvent(
            new ShowToastEvent({
                titile:'Sucess',
                message:'you selected  successfully',
                variant:'success'
            })
        );
        // this.count = 0;
         if(this.recordBookId === this.recordsCount )
         {
             this.count = this.count + 1;
             console.log('you are selected book'+ this.count);
             for(let i=0; i< this.count.length; i++){
                this.selectedRecords.push(this.count[i].Id);
                console.log('@@@Selected records...... ' +JSON.stringify(this.selectedRecords));
    
            }

         }else{
              console.log('sorry you not choose')
         }
         console.log('selected value here  :' +this.recordBookId);
         console.log('selected value count  :'+this.recordsCount);

         
    }
   
    showCart(event){
        this.recordBookId = event.target.dataset.recordId;
        this.isCartbox = true;
    }
    
 //book

 bookName;
 bookPrice;
 authorName;
 bookNumber;
 discription;

 handleBookNameChange(event){
     this.bookName = event.target.value;
     console.log(this.bookName);
 }
 handleBookPriceChange(event){
     this.bookPrice = event.target.value;
 }
 handleAuthorNameChange(event){
     this.authorName = event.target.value;
 }
 /*handleBookNumberChange(event){
      this.bookNumber = event.target.value;
 }*/
 handleDiscriptionChange(event){
     this.discription = event.target.value;
 }
 
      handleSave(){
        const fields = {'Book_Name__c': this.bookName,
                        'Book_price__c': this.bookPrice,
                        'Author_Name__c': this.authorName,
                        //'Name': this.bookNumber, auto increament
                        'Book_Discription__c': this.discription};
        const inputObject = { apiName:'Book__c', fields};

        console.log('Display fields object ' +inputObject);
        createRecord(inputObject)
        .then(result =>{
               console.log('book record is created '+ result.Id);
               console.log('book record display  '+this.result);
               this.dispatchEvent(
                new ShowToastEvent({
                   title:'Success',
                   message:'Book Record is created successfully',
                   variant:'success'
    
                })
            );
            const inputs = this.template.querySelectorAll('lightning-input');
            inputs.forEach(input => {
                input.value = '';
              });
            
        }).catch(error=>{
            this.message = undefined;
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error',
                    message : error.body.message,
                    variant: 'error'
                })
            );
        })
        

    }

   
    showDetails=false;
    actionButtonLabel ='readmore';
     handleChangesshow =() =>{
    this.showDetails=!this.showDetails;
    this.actionButtonLabel = this.showDetails ? 'hide' :'readmore';
    console.log(this.showDetails);
  }
    
}