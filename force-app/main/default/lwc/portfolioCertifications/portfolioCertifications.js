import { LightningElement,wire,api} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets';
import SF_CERT_FIELD from '@salesforce/schema/Portfolio__c.SalesforceCertifications__c';
import OTHER_CERT_FIELD from '@salesforce/schema/Portfolio__c.OtherCertifications__c';
export default class PortfolioCertifications extends LightningElement {
    @api recordId
    certLogo = `${PortfolioAssets}/PortfolioAssets/cert_logo.png`
    sfCertificationList=[];
    otherCertificationList=[];
    isCertificateOpen=false;
    certName='';
    @wire(getRecord, { recordId: '$recordId', fields: [SF_CERT_FIELD, OTHER_CERT_FIELD]})
    certificationsHandler({data,error}){
        if(data){
            // console.log('certifications data is ==> ', JSON.parse(JSON.stringify(data)));
            this.formatCertifications(data)
        }
        if(error){
            console.error('Certifications error', error)
        }
    }

    formatCertifications(data){
        const{SalesforceCertifications__c,OtherCertifications__c} = data.fields
        this.sfCertificationList =SalesforceCertifications__c ?  SalesforceCertifications__c.value.split(";").map((item)=>{
            return `Salesforce Certified ${item}`
        }) : []
        this.otherCertificationList = OtherCertifications__c ?  OtherCertifications__c.value.split(","): [];
    }

    openCertificateHandler(event){
        this.certName= event.currentTarget.dataset.name
        console.log(event.currentTarget.dataset.name)
        this.isCertificateOpen = true;
        
    }

    backHandler(event){
        this.isCertificateOpen = event.detail
    }

}