import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class NavigationProLwc extends NavigationMixin(LightningElement) {

    @api recordId;

   // Navigate to New Account Page
   navigateToNewAccountPage() {
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Account',
            actionName: 'new'
        },
    });
}

// Navigate to View Account Page
navigateToViewAccountPage() {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: '0015g00000Hti78AAB',
            objectApiName: 'Account',
            actionName: 'view'
        },
    });
}
  // Navigate to Edit Account Page
  navigateToEditAccountPage() {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId:'0015g00000Hti78AAB',
            objectApiName: 'Account',
            actionName: 'edit'
        },
    });
   }


   // Navigation to Account List view(recent)
   navigateToAccountListView() {
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Account',
            actionName: 'list'
        },
        state: {
            filterName: 'Recent'
        },
    });
  }

  // Navigation to Contact related list of account
  navigateToContactRelatedList() {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordRelationshipPage',
        attributes: {
            recordId:'0015g00000Hti78AAB',
            objectApiName: 'Account',
            relationshipApiName: 'Contacts',
            actionName: 'view'
        },
    });
  }
}