import { LightningElement, track } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import ANNUALREVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';

import { APPLICATION_SCOPE, createMessageContext,subscribe } from 'lightning/messageService';
import ACOUNTLMC from "@salesforce/messageChannel/AccountMessageChannel__c";

export default class SubscriberComponent extends LightningElement {

recordData = '';
accountId;
recordSource;
//recordData;

 context =createMessageContext();
@track objectApiName= 'Account';
fields = [NAME_FIELD,PHONE_FIELD, INDUSTRY_FIELD,WEBSITE_FIELD,ANNUALREVENUE_FIELD];

      connectedCallback(){
          this.SubscriberLMC();
      }

      SubscriberLMC(){
        subscribe(this.context,ACOUNTLMC, (message) => {
          this. handleMessage(message);
        },{scope: APPLICATION_SCOPE})
      }
      handleMessage(message){
       this.accountId = message.recordId;
       this.recordSource = message.recordSource;
       this.recordData = message.recordData.value;
      }
}