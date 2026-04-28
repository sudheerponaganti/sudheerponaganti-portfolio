import { LightningElement, wire, api } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class PortfolioEducation extends LightningElement {
    educationList = [];
    @api recordId;

    _focusObserver = null;
    _scaleInitialized = false;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Educations__r',
        fields: ['Education__c.InstitutionName__c', 'Education__c.Title__c',
                 'Education__c.PassingGrade__c', 'Education__c.PassingYear__c']
    }) educationHandler({ data, error }) {
        if (data) {
            this.formatEducation(data);
        }
        if (error) {
            console.error('education error', error);
        }
    }

    renderedCallback() {
        if (this._scaleInitialized) return;
        const cards = this.template.querySelectorAll('.edu-card');
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
    }

    disconnectedCallback() {
        if (this._focusObserver) {
            this._focusObserver.disconnect();
            this._focusObserver = null;
        }
    }

    formatEducation(data) {
        this.educationList = data.records.map((item) => {
            const id = item.id;
            let { InstitutionName__c, Title__c, PassingGrade__c, PassingYear__c } = item.fields;
            Title__c           = Title__c.value;
            InstitutionName__c = InstitutionName__c.value;
            PassingGrade__c    = PassingGrade__c.value;
            PassingYear__c     = PassingYear__c.value;
            return { id, Title__c, InstitutionName__c, PassingGrade__c, PassingYear__c };
        });
    }
}