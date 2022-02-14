import { LightningElement , track } from 'lwc';
import getAccounts from '@salesforce/apex/retrieveRecords_EditorApp.fetchAccounts';
import getContacts from '@salesforce/apex/retrieveRecords_EditorApp.fetchContacts';
import { NavigationMixin } from 'lightning/navigation';
export default class MainPanel_EditorApp extends NavigationMixin(LightningElement) {
      
    @track accountsList;
    @track contactsList;
    @track recordAccId;
    @track recordConId;
    @track cssClass = 'slds-col';

    showAccounts = false;
    showContacts = false;
    showModal = false;
    showAccountPreview =false;
    showContactPreview = false;

    connectedCallback(){
        this.showAccounts = true;
        this.handleAccountRecords();
    }

    handleAccountRecords = () =>{
        this.showAccounts = true;
        this.showContacts = false;
        this.showContactPreview = false;
        this.cssClass='slds-col center-div-class';
        getAccounts()
        .then(acc =>
            {
                this.accountsList = acc;
            }
            
        )
        .catch(error => {
            console.log(JSON.stringify(error));
        })
    }

    handleContactRecords = () =>{
        this.showContacts = true;
        this.showAccounts = false;
        this.showAccountPreview = false;
        this.template.querySelector('.centerDiv').classList.remove('center-div-class');
        getContacts()
        .then(con=>{
            this.contactsList = con;
        })

        .catch(error => {
            console.log(JSON.stringify(error));
        })
        
    }

    handleCloseModal = () => {
        this.showModal = false;
    }

    outOfScope = () =>{
        this.showModal = true;
    }

    handleAccountPreview = (event) =>{

        this.recordAccId = event.target.value;
        this.showAccountPreview = true;
        this.showContactPreview = false;
        this.template.querySelector('.centerDiv').classList.add('center-div-class');
    }

    handleContactPreview = (event) =>{
        this.recordConId = event.target.value;
        // this.showContactPreview = true;
        // this.showAccountPreview = false;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordConId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        })

    }

    navigateToFiles = () =>
    {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'ContentDocument',
                actionName: 'home'
            }
        });
    }

    navigateToReports = () =>
    {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Report',
                actionName: 'home'
            },
        });
    }
}