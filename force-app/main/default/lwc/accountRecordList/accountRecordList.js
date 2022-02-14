import { LightningElement, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
export default class AccountRecordList extends LightningElement {


    @wire(getAccountList) accounts;
    accountidfrmparent;
   
    handleClick(event){
        event.preventDefault();     
        this.accountidfrmparent = event.target.dataset.accountid;       
        console.log('account id '+this.accountidfrmparent)
    }

}