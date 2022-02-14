public with sharing class AccountHelperControllerTest {
    
    @AuraEnabled(cacheable=true)
    public static  List<Account> getAccounts(){
       return [SELECT Id,Name,Phone,Website,Industry,Industry_Image__c,Test__c, AnnualRevenue FROM Account];
    
    }
 
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccountNameMethod (String accStrName){
        String keyNameString = '%' +  accStrName + '%';
        return [Select Id, Name, Phone, Website, Industry, AnnualRevenue,Industry_Image__c,Test__c, Rating,Description From Account Where Name like:keyNameString];
        //[SELECT Id,Name,AccountId FROM Opportunity WHERE AccountId=:accountId LIMIT 10000];
        //,(SELECT AccountId, Name, StageName,CloseDate ,Amount FROM Opportunities )
    }  


     @AuraEnabled(cacheable=true)
     public static  List<Account> selectedOption(integer recordSize){
      System.debug('record size::::::::'+recordSize);
     List<Account> sobjList = Database.query('SELECT Id,Name,Phone,Website,Industry,AnnualRevenue,Rating,Industry_Image__c FROM Account limit '+recordSize);
     return sobjList;
  
    }
    
    @AuraEnabled(cacheable=true)
     public static  List<Account> selectedOptionindustry(String industrybased,String All){
       String industryfind = '%' + industrybased + '%';
       String allrecord = '%' + All + '%';
      //System.debug('record size::::::::'+industrybased);
     List<Account> sobjList =[SELECT Id,Name,Phone,Website,Industry,AnnualRevenue,Rating,Industry_Image__c FROM Account WHERE Industry like:industryfind];
     //return [SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account WHERE All Like:allrecord];
     return sobjList;
  
    }

    @AuraEnabled(cacheable=true)
    public static  List<Account> selectedOptioninAll(String All){
      //String industryfind = '%' + industrybased + '%';
      String allrecord = '%' + All + '%';
     //System.debug('record size::::::::'+industrybased);
    List<Account> sobjList =Database.query('SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account'+allrecord);
    //return [SELECT Id,Name,Phone,Website,Industry,AnnualRevenue FROM Account WHERE All Like:allrecord];
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
        return getAccounts();
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
	public static List<Account> getAccountpdfController(){
		return [SELECT Id, Name,AnnualRevenue,Phone, Website, Industry FROM Account LIMIT 12];
	}                           

    @auraEnabled(cacheable=true)
    public static List<Opportunity> fetchOpportunityByAccountId(String accountId){
       // List<Opportunity> oppObj= new List<Opportunity>();
       // List<Opportunity> oppList=[SELECT Id,Name,StageName,CloseDate ,Amount,AccountId FROM Opportunity WHERE AccountId=:accountId LIMIT 10];
       // for(Opportunity opp:oppList){
          //  oppObj.add(opp);
        //}
       // return oppObj;
       return[SELECT Id,Name,StageName,CloseDate ,Amount,AccountId
        FROM Opportunity 
        WHERE AccountId=:accountId
         LIMIT 10];
    } 

    

    /*public class AccountWrapper{  
        @AuraEnabled  
        public string Name;  
        @AuraEnabled  
        public string Phone;  
        public AccountWrapper(Account accountObj){  
          this.Name = accountObj.Name;  
          this.Phone = accountObj.Phone;  
        }  
      }  
      @AuraEnabled
      public static List<AccountWrapper> getAccountExcel(){
        List<AccountWrapper> accountWrapperList = new List<AccountWrapper>();  
         for (Account cwOjb:[SELECT Id, Name,AnnualRevenue,Phone, Website, Industry FROM Account LIMIT 5]){
            accountWrapperList.add(new AccountWrapper(cwOjb));  
         }
         return accountWrapperList;
      }*/



      @AuraEnabled
      public static Account creatAccount(Account accountRecObj){
       
        try{
            insert accountRecObj;
            return accountRecObj;
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }

      }


    @AuraEnabled
    public static List<Account> createAccounts(List<Account>accountList){
       insert accountList;
       return accountList;
    }

}
