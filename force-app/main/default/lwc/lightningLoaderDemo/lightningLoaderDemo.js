import { LightningElement ,api } from 'lwc';

export default class LightningLoaderDemo extends LightningElement {

    @api spinnerText = '';
    @api size= "medium" // small medium and large
    @api variant ="base" // base brand ,inverse

    get helpText(){
        return this.spinnerText? this.spinnerText: 'Loadding spinner'
    }

}