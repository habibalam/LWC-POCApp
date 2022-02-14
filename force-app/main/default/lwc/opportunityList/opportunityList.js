/* eslint-disable no-alert */
import {LightningElement,track,wire,api} from 'lwc';
import fetchOpportunityByAccountId from '@salesforce/apex/AccountHelperControllerTest.fetchOpportunityByAccountId';
export default class OpportunityList extends LightningElement {

//@track accountId;
@track records;
@track error;
@api accountId;

isModalOpen = false;
  @wire(fetchOpportunityByAccountId,{accountId:'$accountId'})
  
  wireoppdata({error,data}){
      if(data){
          this.records=data;
          this.error=undefined;
      }else{
          this.records=undefined;
          this.error=error;
      }
  }
  

  showLoadingSpinner = false;

  handlechange(event){
    this.accountid = event.detail; 
    console.log('calling opportunity method'+this.accountid);
    console.log('show the opportunity details'+JSON.stringify(this.records));
    this.isModalOpen = true;
  }
  /*handleChangeAction(event){
      this.alert('hello');
    this.accountid = event.detail.accountId; 
    console.log('Opportunity event fire' +JSON.stringify(this.accountid));
    this.isModalOpen = true;
  }*/
    /*@api testChildMethod(parentParam){
        alert('this is child method'+parentParam.firstName);
    }*/

    renderedCallback(){
        console.log(JSON.stringify(this.accountId));
        
    }

    closeModal = () =>{
        this.dispatchEvent(new CustomEvent("closemodal"));
        
    }

   

    /*handleEvent(){
        this.accountid=event.target.value;
        window.console.log('accountid'+this.accountd)
        const mycustomEvent=new CustomEvent('myevent',{
            detail:this.accountId
        });
        
        this.dispatchEvent(mycustomEvent);

    }*/
}