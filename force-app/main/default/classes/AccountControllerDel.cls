public with sharing class AccountControllerDel {
    

    @AuraEnabled(cacheable=true)
    public static  List<Account> displayAccounts (){
    //return [SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account LIMIT 40];
    
     return [SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account LIMIT 30 ];
     

   }

   /*@AuraEnabled(cacheable=true)
   public static  List<Account> selectedOption(integer recordSize){
    System.debug('record size::::::::'+recordSize);
   List<Account> sobjList = Database.query('SELECT Id,Name,Phone,Website,Industry,AnnualRevenue from Account LIMIT' +recordSize);
   return sobjList;
  }*/

  @AuraEnabled(Cacheable=true)

    public static List<Account> selectedOption(integer recordSize ){

      system.debug('record size:::'+recordSize);

      List<Account> sobjList = Database.query('SELECT Id,Name,Phone,Website,Industry,AnnualRevenue from Account LIMIT' +recordSize);

      system.debug('sobjecctList:::'+sobjList);

      return sobjList;
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
        return displayAccounts();
   }


   @AuraEnabled(cacheable=true)
   public static List<Account> searchAccountNameMethod (String accStrName, String accStrPhone, String accStrWebsite, String accStrIndustry, String accStrDescription){
       String keyNameString = '%' +  accStrName + '%';
       return [Select Id, Name, Phone, Website, Industry, Description From Account Where Name like:keyNameString];
    }    


}
