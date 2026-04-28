import { LightningElement, api, track } from 'lwc';

// Tab identifiers — drives all active state getters
const TABS = ['summary', 'work', 'projects', 'skills', 'certifications', 'education', 'other'];

// Human-readable label for each tab — displayed in mobile top bar
const TAB_LABELS = {
    summary:        'Summary',
    work:           'Work Experience',
    projects:       'Personal Projects',
    skills:         'Skills',
    certifications: 'Certifications',
    education:      'Education',
    other:          'Other Details'
};

export default class PortfolioTabsWrapper extends LightningElement {

    /* ── Public API ─────────────────────────────────────────────── */
    @api recordId;
    @api objectApiName;

    /* ── Active tab state ───────────────────────────────────────── */
    @track activeTab = 'summary';   // default — first tab open on load

    /* ── Mobile overlay state ───────────────────────────────────── */
    @track isMenuOpen = false;

    /* ── Internal state ─────────────────────────────────────────── */
    _initialized = false;
    _entranceObserver = null;

    /* ── Derived getters ────────────────────────────────────────── */
    get activeTabLabel() {
        return TAB_LABELS[this.activeTab] || '';
    }

    /* ── Lifecycle ──────────────────────────────────────────────── */
    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this._setupEntranceObserver();
        }
    }

    disconnectedCallback() {
        if (this._entranceObserver) {
            this._entranceObserver.disconnect();
            this._entranceObserver = null;
        }
    }

    /* ── Tab bar entrance — fires once when tabs scroll into view ── */
    _setupEntranceObserver() {
        const tabBarWrap = this.template.querySelector('.tab-bar-wrap');
        if (!tabBarWrap) return;

        this._entranceObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('tab-bar-wrap--entering');
                        if (this._entranceObserver) {
                            this._entranceObserver.disconnect();
                            this._entranceObserver = null;
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        this._entranceObserver.observe(tabBarWrap);
    }

    /* ── Active state getters ───────────────────────────────────── */
    get isSummaryActive()        { return this.activeTab === 'summary'; }
    get isWorkActive()           { return this.activeTab === 'work'; }
    get isProjectsActive()       { return this.activeTab === 'projects'; }
    get isSkillsActive()         { return this.activeTab === 'skills'; }
    get isCertificationsActive() { return this.activeTab === 'certifications'; }
    get isEducationActive()      { return this.activeTab === 'education'; }
    get isOtherActive()          { return this.activeTab === 'other'; }

    /* ── Desktop tab click handler ──────────────────────────────── */
    handleTabClick(event) {
        const btn = event.target.closest('[data-tab]');
        if (!btn) return;

        const tab = btn.dataset.tab;
        if (!tab || !TABS.includes(tab) || tab === this.activeTab) return;

        this.activeTab = tab;

        // Scroll active pill into view on tablet-wide bars
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            const activeBtn = this.template.querySelector(`[data-tab="${tab}"]`);
            if (activeBtn && activeBtn.scrollIntoView) {
                activeBtn.scrollIntoView({
                    behavior: 'smooth',
                    block:    'nearest',
                    inline:   'center'
                });
            }
        });
    }

    /* ── Mobile overlay handlers ────────────────────────────────── */
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }

    handleMobileTabClick(event) {
        const btn = event.target.closest('[data-tab]');
        if (!btn) return;

        const tab = btn.dataset.tab;
        if (!tab || !TABS.includes(tab)) return;

        this.activeTab = tab;
        this.isMenuOpen = false;   // close overlay after selection
    }
}