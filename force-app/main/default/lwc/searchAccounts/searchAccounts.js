import { LightningElement, track, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import getAccountsByIndustryOrName from '@salesforce/apex/AccountSearch.getAccountsByIndustryOrName';


export default class SearchAccounts extends LightningElement {
    @track listOfAccounts;
    recordTypeId;
    industryOptions;
    industrySearchValue;
    nameSearchValue;
    isModalOpen = false;
    modalAccountId;
    isSearchResults = true;
    showSpinner = false;
    



    @wire(getObjectInfo, {objectApiName: ACCOUNT_OBJECT})
    getRecordType({data, error}){
        if(data){
            console.log(JSON.stringify(data.defaultRecordTypeId));
            this.recordTypeId = data.defaultRecordTypeId;
        }else if(error){
            console.log("Error Getting Contact RecordTypes=>", JSON.stringify(error));
        }
    }

    @wire(getPicklistValues, {recordTypeId: "$recordTypeId", fieldApiName: INDUSTRY_FIELD})
    industryPicklistValues({data, error}){
        if(data){
            this.industryOptions = data.values;
        }else{
            console.log("Error fetching industryPicklistValues");
            console.log(JSON.stringify(error));
        }
    }

    filterAccounts = () =>{
        getAccountsByIndustryOrName({industry: this.industrySearchValue, accountName: this.nameSearchValue})
        .then(accounts =>{
            this.showSpinner = false;
            this.listOfAccounts = accounts;
            console.log(JSON.stringify(this.listOfAccounts));
            if(this.listOfAccounts.length === 0){
                this.isSearchResults = false;
            }else{
                this.isSearchResults = true;
            }
        })
        .catch(error =>{
            console.log("error while getting accounts=>", JSON.stringify(error));
        })
    }

    handleSearch = (event) =>{
        this.isSearchResults = true;
        this.listOfAccounts = [];
        this.showSpinner = true;
        this.industrySearchValue = this.template.querySelector('.industry-searchbox').value;
        this.nameSearchValue = this.template.querySelector('.name-searchbox').value;
        if(!this.industrySearchValue && !this.nameSearchValue){
            this.showSpinner = false;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: `Type a name to search`,
                variant: 'error',
                mode: 'sticky'
            }));
        }else{
            if(!this.industrySearchValue){
                this.industrySearchValue = '';
            }else if(!this.nameSearchValue){
                this.nameSearchValue = '';
            }
            this.filterAccounts();
        }
    }

    handleEdit = (event) =>{
        this.modalAccountId = event.target.value;
        this.isModalOpen = true;
    }

    handleModalClose = (event) =>{
        this.isModalOpen = false;
    }

    // updateSearch = (event) =>{
    //     refreshApex(this.filterAccounts());
    // }

}