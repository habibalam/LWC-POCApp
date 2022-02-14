import { LightningElement, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
export default class DraggerComponent extends LightningElement {


    @wire(getAccountList) accounts;
    accountidfrmparent;
    handleDragStart(event){
        event.dataTransfer.setData("account_id", event.target.dataset.item);
    }

    handleClick(event){
        event.preventDefault();     
        this.accountidfrmparent = event.target.dataset.accountid;       
        console.log('account id '+this.accountidfrmparent)
    }

}