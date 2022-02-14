public with sharing class OpportunityDetails {
    @auraEnabled
    public static List<Opportunity> fetchOpportunityByAccountId(String accountId)
    {
        return[SELECT Id,Name,StageName,CloseDate ,Amount,AccountId FROM Opportunity WHERE AccountId=:accountId LIMIT 5];
       
    }  
}
