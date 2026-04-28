import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import TECHSKILLS_FIELD from '@salesforce/schema/Portfolio__c.TechnicalSkills__c';
import SOFTSKILLS_FIELD from '@salesforce/schema/Portfolio__c.SoftSkills__c';
import SOFTWARETOOLS_FIELD from '@salesforce/schema/Portfolio__c.SoftwareTools__c';
import SOFTWAREMETHODS_FIELD from '@salesforce/schema/Portfolio__c.SoftwareDevelopmentMethodologies__c';
import AGENTIC_TOOLS_FIELD from '@salesforce/schema/Portfolio__c.Agentic_Tools__c';
import AGENTIC_AI_FIELD from '@salesforce/schema/Portfolio__c.Agentic_AI__c';

// Section keys — drives collapse state
const SECTIONS = ['technical', 'tools', 'methodologies', 'soft', 'agentictools', 'agenticai'];

export default class PortfolioSkills extends LightningElement {

    @api recordId;

    technicalSkills      = [];
    softwareTools        = [];
    softwareMethodologies = [];
    softSkills           = [];
    agenticTools         = [];
    agenticAI            = [];

    // Collapsed state per section — all open by default
    @track collapsedSections = {};

    _focusObserver    = null;
    _scaleInitialized = false;

    /* ── Wire ───────────────────────────────────────────────────── */
    @wire(getRecord, {
        recordId: '$recordId',
        fields: [TECHSKILLS_FIELD, SOFTSKILLS_FIELD, SOFTWARETOOLS_FIELD, SOFTWAREMETHODS_FIELD, AGENTIC_TOOLS_FIELD, AGENTIC_AI_FIELD]
    })
    skillHandler({ data, error }) {
        if (data) { this.formatSkillData(data); }
        if (error) { console.error('skill error', error); }
    }

    /* ── Collapse state getters ─────────────────────────────────── */
    get isTechnicalCollapsed()     { return !!this.collapsedSections['technical']; }
    get isToolsCollapsed()         { return !!this.collapsedSections['tools']; }
    get isMethodsCollapsed()       { return !!this.collapsedSections['methodologies']; }
    get isSoftCollapsed()          { return !!this.collapsedSections['soft']; }
    get isAgenticToolsCollapsed()  { return !!this.collapsedSections['agentictools']; }
    get isAgenticAICollapsed()     { return !!this.collapsedSections['agenticai']; }

    /* ── Computed badge container classes ───────────────────────── */
    get technicalBadgesClass()    { return this._badgesClass('technical'); }
    get toolsBadgesClass()        { return this._badgesClass('tools'); }
    get methodsBadgesClass()      { return this._badgesClass('methodologies'); }
    get softBadgesClass()         { return this._badgesClass('soft'); }
    get agenticToolsBadgesClass() { return this._badgesClass('agentictools'); }
    get agenticAIBadgesClass()    { return this._badgesClass('agenticai'); }

    _badgesClass(section) {
        return `skill-badges${this.collapsedSections[section] ? ' skill-badges--collapsed' : ''}`;
    }

    /* ── Toggle handler ─────────────────────────────────────────── */
    toggleSection(event) {
        const section = event.currentTarget.dataset.section;
        if (!section || !SECTIONS.includes(section)) return;
        // Spread into new object so @track detects the change
        this.collapsedSections = {
            ...this.collapsedSections,
            [section]: !this.collapsedSections[section]
        };
    }

    /* ── Lifecycle ──────────────────────────────────────────────── */
    renderedCallback() {
        if (this._scaleInitialized) return;
        const sections = this.template.querySelectorAll('.skill-section');
        if (!sections.length) return;
        this._scaleInitialized = true;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            sections.forEach(el => el.classList.add('focus-scale--visible'));
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
            { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        );

        sections.forEach((section, i) => {
            section.style.setProperty('--focus-delay', `${i * 0.08}s`);
            this._focusObserver.observe(section);
        });
    }

    disconnectedCallback() {
        if (this._focusObserver) {
            this._focusObserver.disconnect();
            this._focusObserver = null;
        }
    }

    /* ── Data formatting ────────────────────────────────────────── */
    formatSkillData(data) {
        this.technicalSkills       = data.fields.TechnicalSkills__c
            ? getFieldValue(data, TECHSKILLS_FIELD).split(',') : [];
        this.softwareTools         = data.fields.SoftwareTools__c
            ? getFieldValue(data, SOFTWARETOOLS_FIELD).split(',') : [];
        this.softwareMethodologies = data.fields.SoftwareDevelopmentMethodologies__c
            ? getFieldValue(data, SOFTWAREMETHODS_FIELD).split(',') : [];
        this.softSkills            = data.fields.SoftSkills__c
            ? getFieldValue(data, SOFTSKILLS_FIELD).split(',') : [];
        this.agenticTools          = data.fields.Agentic_Tools__c
            ? getFieldValue(data, AGENTIC_TOOLS_FIELD).split(',') : [];
        this.agenticAI             = data.fields.Agentic_AI__c
            ? getFieldValue(data, AGENTIC_AI_FIELD).split(',') : [];
    }
}