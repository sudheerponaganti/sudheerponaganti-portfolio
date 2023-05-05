import { LightningElement,wire,api} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets';
import SUPER_BADGE_FIELD from '@salesforce/schema/Portfolio__c.Superbadges__c';
import AWARDS_FIELD from '@salesforce/schema/Portfolio__c.Awards__c';
import LANGUAGES_FIELD from '@salesforce/schema/Portfolio__c.Languages__c';

export default class PortfolioOtherDetails extends LightningElement {
    trophyImg = `${PortfolioAssets}/PortfolioAssets/trophy.png`
    badgeImg = `${PortfolioAssets}/PortfolioAssets/badge.png`
    languageImg = `${PortfolioAssets}/PortfolioAssets/language.png`
    awardsList = [];
    superBadgesList =[];
    languages=[];
    @api recordId
    @wire(getRecord, { recordId: '$recordId', fields: [SUPER_BADGE_FIELD, AWARDS_FIELD,LANGUAGES_FIELD]})
    otherDetailsHandler({data,error}){
        if(data){
            // console.log('otherDetails data is ==> ', JSON.parse(JSON.stringify(data)));
            this.formatOtherDetails(data)
        }
        if(error){
            console.error('otherDetails error', error)
        }
    }

    formatOtherDetails(data){
        const{Superbadges__c,Awards__c,Languages__c} = data.fields
        this.superBadgesList = Superbadges__c ?  Superbadges__c.value.split(";") : []
        this.awardsList = Awards__c ?  Awards__c.value.split(","): [];
        this.languages = Languages__c ?  Languages__c.value.split(","): [];
    }
}