import { LightningElement,wire,api} from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
const columns = [
    { label: 'Education', fieldName: 'Title__c' },
    { label: 'Institution Name', fieldName: 'InstitutionName__c' },
    { label: 'Passed Grade', fieldName: 'PassingGrade__c' },
    { label: 'Passed Year', fieldName: 'PassingYear__c'}
];
export default class PortfolioEducation extends LightningElement {
    educationList = [];
    columns = columns;
    @api recordId;
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Educations__r',
        fields: ['Education__c.InstitutionName__c','Education__c.Title__c','Education__c.PassingGrade__c','Education__c.PassingYear__c']
    })educationHandler({data,error }) {
        if (data) {
            // console.log('Education Data==>', JSON.parse(JSON.stringify(data)))
            this.formatEducation(data)
        } 
        if (error) {
            console.error('education error',error)
        }
    }

    formatEducation(data){
        this.educationList = data.records.map((item)=>{
      let{InstitutionName__c,Title__c,PassingGrade__c,PassingYear__c} = item.fields;
         Title__c = Title__c.value;
         InstitutionName__c = InstitutionName__c.value;
         PassingGrade__c= PassingGrade__c.value;
         PassingYear__c = PassingYear__c.value;
         return {Title__c,InstitutionName__c,PassingGrade__c,PassingYear__c}
  })
    }

}