import { LightningElement,wire,api} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import TECHSKILLS_FIELD from '@salesforce/schema/Portfolio__c.TechnicalSkills__c';
import SOFTSKILLS_FIELD from '@salesforce/schema/Portfolio__c.SoftSkills__c';
import SOFTWARETOOLS_FIELD from '@salesforce/schema/Portfolio__c.SoftwareTools__c';
import SOFTWAREMETHODS_FIELD from '@salesforce/schema/Portfolio__c.SoftwareDevelopmentMethodologies__c';

export default class PortfolioSkills extends LightningElement {

    @api recordId;
   technicalSkills=[];
   softwareTools = [];
   softwareMethodologies = [];
   softSkills =[];
    @wire(getRecord, { 
        recordId: '$recordId',
        fields :[TECHSKILLS_FIELD,SOFTSKILLS_FIELD,SOFTWARETOOLS_FIELD,SOFTWAREMETHODS_FIELD]
    })skillHandler({data,error}){
        if(data){
            this.formatSkillData(data);
            // console.log('skill data ==>', JSON.parse(JSON.stringify(data)))
        }
        if(error){
            console.log('skill error ==>',error)
        }
    }
    formatSkillData(data){
        this.technicalSkills = data.fields.TechnicalSkills__c ? getFieldValue(data, TECHSKILLS_FIELD).split(",") : [];
        this.softwareTools = data.fields.SoftwareTools__c  ? getFieldValue(data, SOFTWARETOOLS_FIELD).split(","):[];
        this.softwareMethodologies = data.fields.SoftwareDevelopmentMethodologies__c ? getFieldValue(data, SOFTWAREMETHODS_FIELD).split(",") : [];
        this.softSkills = data.fields.SoftSkills__c ? getFieldValue(data, SOFTSKILLS_FIELD).split(",") : [];

        // console.log(JSON.parse(JSON.stringify(techSkillData)))
    }
}