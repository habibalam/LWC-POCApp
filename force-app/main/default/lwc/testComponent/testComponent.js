import { LightningElement, track, wire } from 'lwc';
import getaccounts from '@salesforce/apex/AccountController.getaccountTest';
import getoptions from '@salesforce/apex/AccountController.getoptions';
import industryBasedFilter from '@salesforce/apex/AccountController.industryBasedFilter';
//import searchAccountName from '@salesforce/apex/AccountController.searchAccountName';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex'
import { createRecord } from 'lightning/uiRecordApi';

import insertRecords from '@salesforce/apex/AccountController.insertAccountMethod';

import accName from '@salesforce/schema/Account.Name';
import accPhone from '@salesforce/schema/Account.Phone';
import accIndustry from '@salesforce/schema/Account.Industry';
import accWebsite from '@salesforce/schema/Account.Website';
import accAnnualRevenue from '@salesforce/schema/Account.AnnualRevenue';
//import Industry from '@salesforce/schema/Account.Industry';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

const DELAY = 100;
export default class TestComponent extends LightningElement {


    modalOpen = false;
    @track accountList;
    @track error;
    accountName = '';
    @track totalpage = 0;
    @track page = 1;
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 5; 
    @track totalRecountCount = 0;
    items;

    columns =[
           {label:'Name', fieldName:'Name',sortable:"true"},
           {label:'Industry', fieldName:'Industry',sortable:"true"},
           {label:'Website', fieldName:'Website',sortable:"true"},
           {label:'AnnualRevenue', fieldName:'AnnualRevenue',sortable:"true"},
           {label:'Rating', fieldName:'Rating',sortable:"true"},
           {type:'button', label:'Action',typeAttributes:{
              label:'Delete',name:'Delete',title:'Delete',value:'Delete',iconPosition: 'left' 
           },}

    ];
   
    @wire(getaccounts ,{accStr:'$accountName'})
     wiregetAccount({error,data}){
        this.wireAccountsResult=data;
        if(data){
           this.items = data;
            this.accountList = data;
            console.log('Display account list record'+JSON.stringify(this.accountList));
             this.totalRecountCount  = data.length;
             this.totalpage = Math.ceil(this.totalRecountCount / this.pageSize);
             this.accountList = this.accountList(0,this.pageSize);
             this.endingRecord = this.pageSize

        }
        else if(error){
            this.error=error;
        }
     }

     prviousHandler(){
         if(this.page > 1){
             this.page = this.page -1;
             this.displayRecordPerPage(this.page);
         }
     }

     NextHandler(){
         if((this.page < this.totalpage) && this.page !== this.totalpage){
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
        this.accountList = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }    
  


   
    get options(){
        return[
            {label:'5',value:'5'},
            {label:'10',value:'10'},
            {label:'15',value:'15'},
            {label:'20',value:'20'}
        ];
    }
   
    handleChange(event){
        this.selectedValue=event.detail.value;
        getoptions({recordSize:this.selectedValue})
        .then(result =>{
            this.accountList=result;
            refreshApex(this.wireAccountsResult);
            console.log("display select record"+JSON.stringify(this.accountList));
        })
        .catch(error=>{
           this.error=error;
        })
    }


    get options2(){
        return [
              {label: 'Apparel', value: 'Apparel'},
              { label: 'Biotechnology', value: 'Biotechnology' },
              { label: 'Construction', value: 'Construction' },
              { label: 'Banking', value: 'Banking' },
              { label: 'Energy', value: 'Energy' },
              { label: 'Chemicals', value: 'Chemicals'},
              { label: 'Education', value: 'Education'}
          ];
         }
         handleChange2(event){
             this.selectedValue = event.detail.value;
             console.log('show select value :-'+this.selectedValue)
             industryBasedFilter({industrybased:this.selectedValue})
             .then(result=>{
                 this.accountList = result;
                 console.log('Display record based industry'+JSON.stringify(this.accountList));
             }).catch(error=>{
                 this.error=error;
             })
         }

         handleRowAction(event){
            const recordId=event.detail.row.Id;
            console.log(recordId);
            deleteRecord(recordId)
               .then(()=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Success',
                        message : 'Account Deleted',
                        variant : 'success' 
                    })
                );
                return refreshApex(this.wireAccountsResult);
               })
               // eslint-disable-next-line no-unused-vars
               .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Error',
                        message : 'Error Deleting record',
                        variant : 'error'
                    })
                 );
               })
         }
     
        
         searchAccountAction(event){
            const searchValue = event.target.value;
            window.clearTimeout(this.delayTimeout);
            this.delayTimeout = setTimeout(()=>{
            this.accountName = searchValue;

            },DELAY);
         }
       
  // add new account
  @track accountid;
  @track getAccountRecord={
    Name:accName,       
    Phone:accPhone,  
    Industry:accIndustry, 
    Website:accWebsite,         
    AnnualRevenue:accAnnualRevenue 
  };
  
  nameInpChange(event){
      this.getAccountRecord.Name = event.target.value;
  }

  industryInpChange(event){
    this.getAccountRecord.Industry = event.target.value;
}

phoneInpChange(event){
    this.getAccountRecord.Phone = event.target.value;
}

webisteInpChange(event){
    this.getAccountRecord.Website = event.target.value;
}

annualRevenameInpChange(event){
    this.getAccountRecord.AnnualRevenue = event.target.value;
}

    handleClick(){
        this.modalOpen = true;     
    }
    modalClose(){
        this.modalOpen =false;
        return refreshApex(this.wireAccountsResult);
    }

         saveAccountAction(){
            insertRecords({accountObj:this.getAccountRecord})
            .then(result=>{
             window.console.log(this.createAccount);
             this.getAccountRecord={};
             this.accountid=result.id;
             window.console.log('after save' + this.accountid);

             this.dispatchEvent(
                 new ShowToastEvent({
                    title : 'Success',
                    message : 'Account Created successfully',
                    variant : 'success'
                 })
             );

            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Error',
                        message : 'record is not save',
                        variant : 'error'
                    })
                 );
               })
         }


    @track accountsName;
    @track accountPhone;
    @track accountWebiste;

    accountNameChangeHandler(event){
        this.accountsName = event.target.value;
    }
    accountPhoneChangeHandler(event){
        this.accountPhone = event.target.value;
    }

    accountwebsiteChangeHandler(event){
        this.accountWebiste = event.target.value;
    }

    createAccount(){
        const fields = {'Name':this.accountsName, 'Phone':this.accountPhone,'Website':this.accountWebiste}
         const recordInput ={apiName: 'Account', fields};

         createRecord(recordInput)
         .then(result => {
            console.log('Account is create'+ result.id);
            this.result.forEach(function(item){
             item.Name = '';
             item.Phone = '';
             item.Website = '';
            });
         })
          .catch(error=>{
            console.log('account is not created'+ error.message.body);
          })
    }


    // Reactive variables
    @track controllingValues = [];
    @track dependentValues = [];
    @track selectedCountry;
    @track selectedState;
    @track isEmpty = false;
    controlValues;
    totalDependentValues = [];

   @wire(getObjectInfo, {objectApiName:ACCOUNT_OBJECT})
   objectInfo;

    @wire(getPicklistValuesByRecordType,{ objectApiName: ACCOUNT_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
    countrypicklistValue({error,data}){

        if(data){
            this.error = null;
            let countryOptions = [{label :'None',value:'None'}];
            data.picklistFieldValues.Country__c.values.forEach(key =>{

                countryOptions.push({
                    label: key.label,
                    value: key.value
                })
            });
            this.controllingValues = countryOptions;


            let stateOptions = [{label :'None',value:'None'}];
             this.controlValues = data.picklistFieldValues.State__c.controllingValues;
             this.totalDependentValues = data.picklistFieldValues.State__c.values;
             this.totalDependentValues.forEach(key=>{
                 stateOptions.push({
                     label:key.label,
                     value:key.value

                 })
             })
             this.dependentValues = stateOptions;
        }
        else if(error){
            this.error=error;
        }
    }

    handleCountryChange(event) {
        // Selected Country Value
        this.selectedCountry = event.target.value;
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
    }


  //create record using CreateRecordUI

  accName;
  accPhone;
  accEmail;

  handleNameChange(event){
      this.accName=event.target.value;
  }

  handlePhoneChange(event){
    this.accPhone = event.target.value;

  }
  handleWebsiteChange(event){
      this.accWebsite = event.target.value;
  }
  
  handleSave(){
     const fields = { 'Name':this.accName ,'Phone':this.accPhone ,'Website':this.accWebsite};
     const objectRecordIput = {apiName:'Account',fields}; 
     createRecord(objectRecordIput)
      .then(result =>{
        //this.message = result;
        //this.error = undefined;
       /* this.fields.forEach(function(item){
            item.accName = '';
            item.accPhone = '';
            item.accWebsite = '';  
          });*/
           console.log('Account is created  :'+result.id);
            this.dispatchEvent(
            new ShowToastEvent({
               title:'Success',
               message:'Record is created successfully',
               variant:'success'

            })
          );
          //this.template.querySelector('lightning-input').fields.;
          
      })
      
      .catch(error=>{
          this.dispatchEvent(
              new ShowToastEvent({
                  title:'Error',
                  message : error.body.message,
                  variant: 'error'
              })
          );
      })

  }


}