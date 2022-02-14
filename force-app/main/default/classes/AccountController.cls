public with sharing class AccountController {
   
    @AuraEnabled(cacheable=true)
    public static  List<account> getAccountList (){
      return [SELECT Id,Name,phone,Website,Industry,AnnualRevenue ,Industry_Image__c from Account LIMIT 7];
     } 

     @AuraEnabled(cacheable=true)
     public static List<Contact> getContactList(){
         return [SELECT Id, Name,Phone,Email,FirstName,LastName ,AccountId FROM Contact LIMIT 30];
     }
   
   @AuraEnabled(cacheable=true)
   public static List<Contact> findContactByAccountId(String accountId) {      
       return [
           SELECT Id, FirstName,LastName,Email,Phone  
           FROM Contact 
           WHERE AccountId=:accountId 

           LIMIT 10];
   }


   @auraEnabled(cacheable=true)       
   public static List<Opportunity> fetchOpportunityByAccountId(String accountId){
     // List<Opportunity> oppObj= new List<Opportunity>();
      //List<Opportunity> oppList=[SELECT Id,Name,StageName,CloseDate,Amount FROM Opportunity WHERE AccountId=:accountId LIMIT 5];
       //for(Opportunity opp:oppList){
         // oppObj.add(opp);
      //}
      //return oppObj;
       return[SELECT Id,Name,StageName,CloseDate ,Amount,AccountId
        FROM Opportunity 
        WHERE AccountId=:accountId
         LIMIT 10];
   }  

   @AuraEnabled(cacheable=true)
   public static List<DataSet> getAllAccountsByRating(){
   List<AggregateResult> result =  [Select Count(Id) cnt, Rating from Account  group by Rating limit 10];
   List<DataSet> dataSet = new List<DataSet>();
   for(AggregateResult ar:result){
   String status =  (String)ar.get('Rating') ;
   Integer total =(Integer)ar.get('cnt');
   dataSet.add(new DataSet(status ,total));
   }
   System.debug('dataSet'+dataSet);
   return dataSet ;
   }

     public class DataSet
    {
     public DataSet(String label ,Integer count){
     this.label  = label ;
     this.count = count ;
    }


   @AuraEnabled
   public String label {get;set;}
   @AuraEnabled
   public Integer  count {get;set;}
   }
  

   @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities(){
        return [SELECT COUNT(Id) Total, StageName FROM Opportunity GROUP BY StageName];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getRating(){
        return [Select Count(Id) cnt, Rating from Account  group by Rating limit 10];
    }
  
    //===================for testing perpust create this below classes=================================
    @AuraEnabled(cacheable= true)
    public static List<Account> getaccountTest(String accStr){
      String keyNameString = '%' + accStr + '%';
      return [SELECT Id,Name,Industry,Website,AnnualRevenue,Rating FROM Account WHERE Name LIKE:keyNameString];

     }

      @AuraEnabled(cacheable= true)
      public static List<Account> getoptions(Integer recordSize){
      List<Account> accObj=Database.query('SELECT Id,Name,Industry,Website,AnnualRevenue,Rating FROM Account LIMIT '+recordSize);
        return accObj;
     }

      @AuraEnabled(cacheable= true)
      public static List<Account> industryBasedFilter(String industrybased){
      String industryfind = '%'+industrybased+'%';
      List<Account> objList = [SELECT Id,Name,Industry,Website,AnnualRevenue,Rating FROM Account WHERE Industry like:industryfind];
       return objList;
    }
   
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccountName (String accStr){
        String keyNameString = '%' + accStr + '%';
        return [Select Id, Name, Phone, Website, Industry, AnnualRevenue,Rating,Description From Account Where Name like:keyNameString];
        //[SELECT Id,Name,AccountId FROM Opportunity WHERE AccountId=:accountId LIMIT 10000];
        //,(SELECT AccountId, Name, StageName,CloseDate ,Amount FROM Opportunities )
    }  

    @AuraEnabled
   public static Account insertAccountMethod(Account accountObj){
       try {
           insert accountObj;
           return accountObj;
       } catch (Exception exp) {
           throw new AuraHandledException(exp.getMessage());
       }
   }

     @AuraEnabled(cacheable=true)
     public static List<Book__c> getBookDetails(){
      return[SELECT Name,Author_Name__c,Book_Name__c,Book_price__c,Book_Discription__c, Book_image__c From Book__c];

      }

     
    
}
