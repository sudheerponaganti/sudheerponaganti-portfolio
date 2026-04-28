import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets';
import SF_CERT_FIELD from '@salesforce/schema/Portfolio__c.SalesforceCertifications__c';
import OTHER_CERT_FIELD from '@salesforce/schema/Portfolio__c.OtherCertifications__c';

export default class PortfolioCertifications extends LightningElement {
    @api recordId;
    certLogo = `${PortfolioAssets}/PortfolioAssets/cert_logo.png`;
    sfCertificationList    = [];
    otherCertificationList = [];
    isCertificateOpen = false;
    certName = '';

    // Collapsed state for each section
    @track isSfCollapsed    = false;
    @track isOtherCollapsed = false;

    _focusObserver    = null;
    _scaleInitialized = false;

    /* ── Computed classes ───────────────────────────────────────── */
    get sfGridClass()    { return `cert-grid${this.isSfCollapsed    ? ' cert-grid--collapsed' : ''}`; }
    get otherGridClass() { return `cert-grid${this.isOtherCollapsed ? ' cert-grid--collapsed' : ''}`; }

    /* ── Wire ───────────────────────────────────────────────────── */
    @wire(getRecord, { recordId: '$recordId', fields: [SF_CERT_FIELD, OTHER_CERT_FIELD] })
    certificationsHandler({ data, error }) {
        if (data)  { this.formatCertifications(data); }
        if (error) { console.error('Certifications error', error); }
    }

    formatCertifications(data) {
        const { SalesforceCertifications__c, OtherCertifications__c } = data.fields;
        this.sfCertificationList = SalesforceCertifications__c
            ? SalesforceCertifications__c.value.split(';').map((item) => ({
                certificateName: `Salesforce Certified ${item}`,
                certificateLogo: `${PortfolioAssets}/PortfolioAssets/Salesforce Certified ${item}.png`
            }))
            : [];
        this.otherCertificationList = OtherCertifications__c
            ? OtherCertifications__c.value.split(',')
            : [];
    }

    /* ── Section toggle handlers ────────────────────────────────── */
    toggleSfSection() {
        this.isSfCollapsed = !this.isSfCollapsed;
    }

    toggleOtherSection() {
        this.isOtherCollapsed = !this.isOtherCollapsed;
    }

    /* ── Lifecycle ──────────────────────────────────────────────── */
    renderedCallback() {
        if (this._scaleInitialized) return;
        const cards = this.template.querySelectorAll('.cert-box');
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
            card.style.setProperty('--focus-delay', `${i * 0.06}s`);
            this._focusObserver.observe(card);
        });
    }

    disconnectedCallback() {
        if (this._focusObserver) {
            this._focusObserver.disconnect();
            this._focusObserver = null;
        }
    }

    openCertificateHandler(event) {
        this.certName = event.currentTarget.dataset.name;
        this.isCertificateOpen = true;
    }

    backHandler(event) {
        this._scaleInitialized = false;
        if (this._focusObserver) {
            this._focusObserver.disconnect();
            this._focusObserver = null;
        }
        this.isCertificateOpen = event.detail;
    }
}