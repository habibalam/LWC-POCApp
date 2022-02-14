import { LightningElement } from 'lwc';
import hasAccessUI from '@salesforce/customPermission/myFirstCustomPermission';

export default class PermissionSetUI extends LightningElement {

get isUIAccessible(){
    return hasAccessUI;
}


}