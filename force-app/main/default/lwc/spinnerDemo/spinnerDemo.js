import { LightningElement } from 'lwc';

export default class SpinnerDemo extends LightningElement {
 
    showOne = false;
    spinnerHandler(){
       this.showOne = true;
    }
}