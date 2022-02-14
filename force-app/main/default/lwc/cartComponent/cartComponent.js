import { LightningElement,api} from 'lwc';

export default class CartComponent extends LightningElement {

 @api recordId;

 renderedCallback(){
    console.log(JSON.stringify(this.recordId));
    
}

 closeModal = () =>{
    this.dispatchEvent(new CustomEvent("closemodal"));
 
    }
}