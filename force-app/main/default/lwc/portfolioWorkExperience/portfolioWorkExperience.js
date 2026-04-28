import { LightningElement ,wire,api,track} from 'lwc';
import { getRelatedListRecords} from 'lightning/uiRelatedListApi';
import CompanyLogosZip from '@salesforce/resourceUrl/CompanyLogosZip';
export default class PortfolioWorkExperience extends LightningElement {

    @track workExperienceList=[];
    @api recordId;

    _focusObserver = null;
    _scaleInitialized = false;

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

    renderedCallback() {
        if (this._scaleInitialized) return;
        const cards = this.template.querySelectorAll('.exp-card');
        if (!cards.length) return;
        this._scaleInitialized = true;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            cards.forEach(el => el.classList.add('focus-scale--visible'));
            return;
        }

        this._focusObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('focus-scale--visible');
                        this._focusObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.10, rootMargin: '0px 0px -20px 0px' }
        );

        cards.forEach((card, i) => {
            card.style.setProperty('--focus-delay', `${i * 0.07}s`);
            this._focusObserver.observe(card);
        });

        // Descriptions are expanded by default on all screen sizes.
        // The user can tap/click the header to collapse individual entries.
    }

    disconnectedCallback() {
        if (this._focusObserver) {
            this._focusObserver.disconnect();
            this._focusObserver = null;
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
           let companyLogo = `${CompanyLogosZip}/CompanyLogos/${companyName}-svg-logo.svg`;
        // Collapse descriptions by default on mobile for a cleaner list view
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        return {id,apiName,JobStartDate,JobEndDate,companyName,WorkLocation,JobDescription,IsCurrent,Role,isTimelineOpen : true,companyLogo, defaultCollapsed: isMobile}
        })
        // console.log('workExperienceList is ==>', JSON.parse(JSON.stringify(this.workExperienceList)))
    }

    getValue(data){
        return data && (data.displayValue || data.value);
    }

    toggleDescription(event) {
        const id = event.currentTarget.dataset.id;
        const desc = this.template.querySelector(`.exp-description[data-desc="${id}"]`);
        const btn  = this.template.querySelector(`.exp-chevron[data-id="${id}"]`);
        desc.classList.toggle('collapsed');
        btn.classList.toggle('rotated');
    }
}