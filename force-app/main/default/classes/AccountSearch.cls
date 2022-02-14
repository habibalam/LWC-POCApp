public with sharing class AccountSearch {
    
   @AuraEnabled
    public static List<Account> getAccountsByIndustryOrName(String industry, String accountName){
        String query = 'SELECT Id, Name, Phone, Website, Industry, Industry_Image__c FROM Account WHERE';
        if(!String.isEmpty(industry)){
            query = query + ' Industry=\'' + String.escapeSingleQuotes(industry) + '\'';
            if(!String.isEmpty(accountName)){
                query = query + ' AND Name LIKE \'%' + String.escapeSingleQuotes(accountName) + '%\'';
            }
        }
        else if(!String.isEmpty(accountName)){
            query = query + ' Name LIKE \'%' + String.escapeSingleQuotes(accountName) + '%\'';
        }
        System.debug(query);
        List<Account> records = Database.query(query);
        System.debug(records);
        return records;
    }
}
