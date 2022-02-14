import { LightningElement,api,wire } from 'lwc';
import fetchOpportunityByAccountId from '@salesforce/apex/AccountController.fetchOpportunityByAccountId';
export default class OpportunityRecordList extends LightningElement {



//@track records;
  
columns =  [
   { label: 'Name', fieldName: 'Name' },
   { label: 'StageName', fieldName: 'StageName'},
   { label: 'CloseDate', fieldName: 'CloseDate'},
   { label: 'Amount', fieldName: 'Amount'},
    
];
   @api accountId;

@wire(fetchOpportunityByAccountId,{accountId:'$accountId'}) records;

}