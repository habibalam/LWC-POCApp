import { LightningElement,track, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountHelper.getAccountList';
export default class SppinerDataload extends LightningElement {


    @track accounts;
    @track error;
    @track isLoading = false;
    
       /* @wire(getAccountList)
        accountRecords({accounts , error}){
            if(accounts){
                this.isLoading = true;
                this.accounts =accounts;
               
            }
            else if(error){
                this.accounts = undefined;
                this.isLoading = false;
            }

         
        }*/
    
        handleLoad(){
            this.isLoading = true;
            getAccountList()
            .then(result=>{
                this.accounts = result;
                this.isLoading = false;

            })
            .catch(error=>{
                this.error=error;
                this.isLoading=false
            })
        }
            
    
}