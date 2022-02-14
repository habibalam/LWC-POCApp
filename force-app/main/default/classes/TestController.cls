public with sharing class TestController {
    


    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name, Type, Rating,Phone, Website, AnnualRevenue  FROM Account];
            
    }
   
    @AuraEnabled(cacheable=true)
    public static  List<Account> selectedOption(integer recordSize){
     System.debug('record size::::::::'+recordSize);
    List<Account> sobjList = Database.query('SELECT Id,Name,Type, Rating, Phone,Website,AnnualRevenue FROM Account limit '+recordSize);
    system.debug('sobjecctList:::'+sobjList);
    return sobjList;
 
   }
   
  /* @AuraEnabled(Cacheable=true)
    public static List<Contact> selectedOption(integer recordSize ){
      system.debug('record size:::'+recordSize); 
      List<Contact> sobjList = Database.query('SELECT FirstName, LastName, Birthdate, MailingPostalCode , Phone, Email FROM Contact limit '+recordSize);
      system.debug('sobjecctList:::'+sobjList);
      return sobjList;
    }*/

}