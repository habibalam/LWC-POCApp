import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ShowToastEventMsg extends LightningElement {

 showError(){
     const vet = new ShowToastEvent({
         title: 'salesforce Toast',
         message :'salesforce Lwc component',
         variant : 'error'

     });
     this.dispatchEvent(vet);
 }

 showWarning(){
    const vet = new ShowToastEvent({
        title: 'salesforce Toast',
        message :'salesforce Lwc component',
        variant : 'warning'

    });
    this.dispatchEvent(vet);
}

showSuccess(){
    const vet = new ShowToastEvent({
        title: 'salesforce Toast',
        message :'salesforce Lwc component',
        variant : 'success'

    });
    this.dispatchEvent(vet);
}

showInfo(){
    const vet = new ShowToastEvent({
        title: 'salesforce Toast',
        message :'salesforce Lwc component',
        variant : 'info'

    });
    this.dispatchEvent(vet);
}



}