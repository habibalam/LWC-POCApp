import { LightningElement, track } from 'lwc';
// eslint-disable-next-line no-unused-vars
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import { createMessageContext,publish } from 'lightning/messageService';
import ACOUNTLMC from "@salesforce/messageChannel/AccountMessageChannel__c";

export default class PublisherComponent extends LightningElement {

@track accountList;

context = createMessageContext();

   connectedCallback(){
       getAccountList()
             .then(result =>{
                 this.accountList=result;
             })
             .catch(error =>{
                this.error=error;
             });
   }
    
   handleClick(event){
      event.preventDefault();
      const payload ={

        recordId :event.target.dataset.value,
        recordIdData : {value: "Message From Lwc publisher compoent"},
        recordSource : "lwc"
        }
        publish(this.context,ACOUNTLMC,payload);
   }

}