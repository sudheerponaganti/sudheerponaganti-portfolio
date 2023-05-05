public without sharing class NoteTakingController {
   
    @AuraEnabled
    public static String createNoteRecord(Map<String,String> noteRecord){
        try {
            if(!String.isBlank(noteRecord.get('Name'))){
                My_Note__c newNote = new My_Note__c(Name = noteRecord.get('Name'), Note_Description__c = noteRecord.get('Note_Description__c'));
                insert newNote;
                return String.valueOf(newNote.Id);
            }
            return 'Name is Blank';
        } catch (Exception e) { 
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String updateNoteRecord(String noteId, String title, String description){
        try {
            if(!String.isBlank(noteId)){
                My_Note__c updateNote = [SELECT Id, Name,Note_Description__c FROM My_Note__c WHERE Id =:noteId];
                updateNote.Name = title;
                updateNote.Note_Description__c =description; 
                update updateNote;
                return String.valueOf(updateNote.Id);
            }
            return 'No Record is Available';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<My_Note__c> getNoteRecords(){
        try {
           List<My_Note__c> myNoteCards = [SELECT Id,Name,Note_Description__c,LastModifiedDate FROM My_Note__c ORDER BY LastModifiedDate DESC ];
            return myNoteCards;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String deleteNoteRecord(String noteId){
        try {
            if(!String.isBlank(noteId)){
                // My_Note__c deleteNote = [SELECT Id, Name,Note_Description__c FROM My_Note__c WHERE Id =:noteId];
                My_Note__c deleteNote = new My_Note__c(Id =noteId);
                delete deleteNote;
                return String.valueOf(deleteNote.Id);
            }
            return 'No Record is Available';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}