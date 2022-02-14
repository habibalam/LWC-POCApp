/* eslint-disable no-unused-vars */
import { api, LightningElement, track, wire } from 'lwc';
import fetchOpportunityByAccountId from '@salesforce/apex/AccountController.fetchOpportunityByAccountId';

export default class OpportunityRelatedAccount extends LightningElement {

 //@track records;
 @track error; 
 @track data;  
 columns =  [
    { label: 'Name', fieldName: 'Name' },
    { label: 'StageName', fieldName: 'StageName'},
    { label: 'CloseDate', fieldName: 'CloseDate'}   
];
    @api accountId;

 @wire(fetchOpportunityByAccountId,{accountId:'$accountId'}) records;
 
 /*wireoppdata({error,data}){
    if(data){
        this.records=this.data;
        console.log('Display opportunity recod '+this.records);
        this.error=undefined;
    }else{
        this.records=undefined;
        this.error=error;
    }
  }*/  

}


