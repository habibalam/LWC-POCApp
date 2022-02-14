import { LightningElement } from 'lwc';

export default class CondtionalRenderElement extends LightningElement {

myValue= "salesforce App";
showMe=false;
handleChange(event) {

    this.showMe = event.target.checked;
 }

}