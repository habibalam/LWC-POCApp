import { LightningElement,wire,track} from 'lwc';
import getContactDetails from '@salesforce/apex/ContactDetailsController.getContactDetails';

const actions = [
    { label: 'View Details', name: 'view_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'name', type:'text'},
    { label: 'Title', fieldName: 'title', type: 'text' },
    { label: 'Mobile', fieldName: 'mobileNumber', type: 'phone' },
    { label: 'Email', fieldName: 'email', type: 'email' },

    { label: 'Account Name', fieldName: 'accountUrl', type: 'url',
            typeAttributes:{label:{fieldName: 'accountName'},target:'_blank'} },
    { label: 'Account Number', fieldName: 'accountNumber', type: 'text' },

    { label: 'Account Rating', fieldName: 'rating', type: 'text', cellAttributes:
            { iconName: { fieldName: 'accountRatingIcon' }, iconPosition: 'right' }},
            
    { label: 'Industry', fieldName: 'industry', type: 'text' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },

    
];

export default class ContactDetails extends LightningElement {

    @track columns = columns;
    @track data;
    contacts;
    accountUrl;

    @wire(getContactDetails)
    wiredContacts({data}){
        if(data){
            this.contacts = data;
            let contactsList = [];

            //loop through the list of contacts and assign an icon based on the rating
            this.contacts.forEach(record => {
                //copy the details in record object to contactObj object
                let contactObj = {...record};
                if(record.accountRating === 'Hot'){
                    contactObj.accountRatingIcon = "custom:custom1";
                }else if(record.accountRating === 'Warm'){
                    contactObj.accountRatingIcon = "custom:custom3";
                }else if(record.accountRating === 'Cold'){
                    contactObj.accountRatingIcon = "custom:custom5";
                }else{
                    contactObj.accountRatingIcon = "standard:empty";
                }
                // eslint-disable-next-line no-undef
                // eslint-disable-next-line dot-notation
                contactObj['accountUrl'] = '/lightning/r/Account/' + record.accountId +'/view';
                contactsList.push(contactObj);
                ///console.log('Display value is:Contact Records@#############'+JSON.stringify(this.contactList));
            });
            this.data = contactsList;
        }
    }




}



