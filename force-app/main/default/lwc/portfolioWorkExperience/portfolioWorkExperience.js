import { LightningElement ,wire,api,track} from 'lwc';
import { getRelatedListRecords} from 'lightning/uiRelatedListApi';
export default class PortfolioWorkExperience extends LightningElement {

    @track workExperienceList=[];
    @api recordId;
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'WorkExperiences__r',
        fields: ['WorkExperience__c.JobStartDate__c',
                'WorkExperience__c.JobEndDate__c',
                'WorkExperience__c.Role__c',
                'WorkExperience__c.CompanyName__c',
                'WorkExperience__c.WorkLocation__c',
                'WorkExperience__c.JobDescription__c',
                'WorkExperience__c.IsCurrent__c']
    })listInfo({ error, data }) {
        if (data) {
            this.formatExperience(data);
        } else if (error) {
            console.error('error came => ',error)
        }
    }


    formatExperience(data){
        // console.log('work data is ==> ', JSON.parse(JSON.stringify(data)));
        this.workExperienceList = [...data.records].reverse().map((item)=>{
            let id = item.id;
            let apiName = item.apiName;
            const {JobStartDate__c,JobEndDate__c,Role__c,CompanyName__c,WorkLocation__c,JobDescription__c,IsCurrent__c} = item.fields;
           let JobStartDate = this.getValue(JobStartDate__c);
           let JobEndDate = this.getValue(JobEndDate__c);
           let companyName = this.getValue(CompanyName__c);
           let WorkLocation = this.getValue(WorkLocation__c);
           let JobDescription = this.getValue(JobDescription__c);
           let IsCurrent = this.getValue(IsCurrent__c);
           let Role = this.getValue(Role__c);
           
        return {id,apiName,JobStartDate,JobEndDate,companyName,WorkLocation,JobDescription,IsCurrent,Role,isTimelineOpen : true}
        })
        // console.log('workExperienceList is ==>', JSON.parse(JSON.stringify(this.workExperienceList)))
    }

    getValue(data){
    return data && (data.displayValue || data.value);
    }

    timelineHandler(event){
        let id = event.currentTarget.dataset.id;
        // this.workExperienceList.forEach((item)=>{
        //     if(item.id === id){
        //         item.isTimelineOpen = !item.isTimelineOpen;
        //     }
        // })
    this.template.querySelector(`div[data-index="${id}"]`).classList.toggle("slds-is-open")
    this.template.querySelector(`button[data-id="${id}"]`).classList.toggle("de-active")   
     }

}