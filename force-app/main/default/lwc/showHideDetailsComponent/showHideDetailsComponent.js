import { LightningElement } from 'lwc';

export default class ShowHideDetailsComponent extends LightningElement {

name = 'Aftab';
details = 'Aftab is a CEO of Wipro company from 8 years';
showDetails=false;

actionButtonLabel ='show Details';

handleChange =() =>{
this.showDetails=!this.showDetails;
this.actionButtonLabel = this.showDetails ? 'Hide Details' :'show Details';
console.log(this.showDetails);

}


}