import { LightningElement ,api} from 'lwc';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShowAccountDetails extends LightningElement {

    @api accId;
    dataList;
  
    showLoadingSpinner = false;
    renderedCallback(){
        console.log(JSON.stringify(this.accInfo));
        this.dataList=this.accInfo;
        
    }

    closeModal = () =>{
        this.dispatchEvent(new CustomEvent("closemodal"));
        
    }

}