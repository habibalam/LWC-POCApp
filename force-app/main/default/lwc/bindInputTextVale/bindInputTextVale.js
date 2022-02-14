import { LightningElement } from 'lwc';

export default class BindInputTextVale extends LightningElement {

    myValue = 'Salesforce App';

    handleChange(event){
        this.myValue=event.target.value;
    }
}