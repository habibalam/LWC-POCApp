import { LightningElement } from 'lwc';

export default class BindExpressionjs extends LightningElement {

    fName = '';
    email = '';
    phone = '';

    handleChange(event){
      
        const field= event.target.name;

        if(field =='fName'){
            this.fName = event.target.value;
        }
        else if(field =='email'){
            this.email = event.target.value;
        }
         else if(field =='phone'){
             this.phone = event.target.value;
         }

    }

    get upperCase() {
        return `${this.fName}`.toUpperCase();
    }
}