public with sharing class AccountsHelperController {
   


   @AuraEnabled(cacheable=true)
   public static  List<Account> getAccounts(){
      return [SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account];
   
   }

   @AuraEnabled(cacheable=true)
   public static  List<Account> selectedOption(integer recordSize){
    System.debug('record size::::::::'+recordSize);
   List<Account> sobjList = Database.query('SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account limit '+recordSize);
   return sobjList;

  }

  @AuraEnabled(cacheable=true)
  public static List<Account> searchAccountNameMethod (String accStrName, String accStrPhone, String accStrWebsite, String accStrIndustry, String accStrDescription){
      String keyNameString = '%' +  accStrName + '%';
      return [Select Id, Name, Phone, Website, Industry, Description From Account Where Name like:keyNameString];
   }  
   @AuraEnabled
   public static List<Account> delAccRecord(List<String>acclist){
       List<Account> delAcclist = new List<Account>();
       for(Account acc:[select Id from Account where Id in:acclist]){
           delAcclist.add(acc);
       }
       if(delAcclist.size()>0){
           try{
               delete delAcclist;
           }
           catch(Exception e){
               throw new AuraHandledException('unable to delete'+e.getMessage());
           }
       }
        return getAccounts();
   }
}