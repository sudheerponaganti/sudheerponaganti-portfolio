import { LightningElement, wire, api } from 'lwc';
import PortfolioAssetsZip from '@salesforce/resourceUrl/PortfolioAssets';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import FULLNAME_FIELD from '@salesforce/schema/Portfolio__c.FullName__c';
import DESIGNATION_FIELD from '@salesforce/schema/Portfolio__c.Designation__c';
import COMPANYNAME_FIELD from '@salesforce/schema/Portfolio__c.CompanyName__c';
import COMPANYLOCATION_FIELD from '@salesforce/schema/Portfolio__c.CompanyLocation__c';

export default class PortfolioBanner extends LightningElement {
    @api recordId;
    @api linkedinUrl;
    @api twitterUrl;
    @api githubUrl;
    @api youtubeUrl;
    @api trailheadUrl;
    @api codepenUrl;

    socialMediaIcons = {
        sudheerPic: `${PortfolioAssetsZip}/PortfolioAssets/SudheerProfilePic.jpg`,
        linkedin:   `${PortfolioAssetsZip}/PortfolioAssets/Social/linkedin.svg`,
        github:     `${PortfolioAssetsZip}/PortfolioAssets/Social/github.svg`,
        trailhead:  `${PortfolioAssetsZip}/PortfolioAssets/Social/trailhead1.svg`,
        twitter:    `${PortfolioAssetsZip}/PortfolioAssets/Social/twitter.svg`,
        youtube:    `${PortfolioAssetsZip}/PortfolioAssets/Social/youtube.svg`,
        codepen:    `${PortfolioAssetsZip}/PortfolioAssets/Social/codepen.svg`,
        xTwitter:   `${PortfolioAssetsZip}/PortfolioAssets/Social/x-twitter.svg`
    };

    // Private state flag — prevent double-init on re-renders
    _initialized = false;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [FULLNAME_FIELD, DESIGNATION_FIELD, COMPANYNAME_FIELD, COMPANYLOCATION_FIELD]
    })
    portfolioData;

    get fullName()       { return getFieldValue(this.portfolioData.data, FULLNAME_FIELD);       }
    get designation()    { return getFieldValue(this.portfolioData.data, DESIGNATION_FIELD);    }
    get companyName()    { return getFieldValue(this.portfolioData.data, COMPANYNAME_FIELD);    }
    get companyLocation(){ return getFieldValue(this.portfolioData.data, COMPANYLOCATION_FIELD);}

    renderedCallback() {
        // ── 1. Staggered icon entrance ───────────────────────────────
        // Each pill gets .icon-visible after a cascading setTimeout.
        // 480ms base delay lets the card-rise animation finish first.
        const icons = this.template.querySelectorAll('.social-pill');
        icons.forEach((icon) => {
            const idx = parseInt(icon.dataset.index || '0', 10);
            setTimeout(() => {
                icon.classList.add('icon-visible');
            }, 480 + idx * 80);
        });

        // ── 2. One-time fluid glass effects ─────────────────────────
        // Guard: renderedCallback fires on every reactive property change.
        // We only want to start the RAF loop and attach mouse listeners once.
        if (this._initialized) return;
        this._initialized = true;

        this._startMouseParallax();
    }

    disconnectedCallback() {
        // Remove mouse listeners on unmount
        if (this._banner) {
            this._banner.removeEventListener('mousemove', this._onMouseMove);
            this._banner.removeEventListener('mouseleave', this._onMouseLeave);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Mouse parallax tilt
    // ─────────────────────────────────────────────────────────────────
    // Technique: On mousemove within the banner, compute cursor position
    // relative to the card centre, map to ±TILT_DEG rotation, apply as
    // CSS perspective transform. On mouseleave, spring back to identity.
    //
    // This is the core interaction Apple uses in visionOS hover states —
    // the surface appears to tilt toward the cursor like physical glass.
    //
    // Parameters:
    //   TILT_DEG  = 6   → max 6° tilt — subtle, not nauseating
    //   SCALE     = 1.015 → 1.5% scale lift on hover
    //   PERSPECTIVE = 1200px → realistic 3D depth (lower = more distorted)
    //   Transition on mousemove: 0.08s ease-out → snappy tracking
    //   Transition on mouseleave: 0.7s spring → smooth return
    // ─────────────────────────────────────────────────────────────────
    _startMouseParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const banner = this.template.querySelector('.banner');
        const card   = this.template.querySelector('.glass-card');
        if (!banner || !card) return;

        this._banner = banner;

        const TILT_DEG   = 6;
        const SCALE      = 1.015;
        const PERSPECTIVE = 1200;

        this._onMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            // Normalise cursor to -1…+1 relative to card centre
            const dx = (e.clientX - (rect.left + rect.width  * 0.5)) / (rect.width  * 0.5);
            const dy = (e.clientY - (rect.top  + rect.height * 0.5)) / (rect.height * 0.5);

            // Clamp to -1…+1 so moving outside card doesn't overshoot
            const rx = Math.max(-1, Math.min(1, -dy)) * TILT_DEG;
            const ry = Math.max(-1, Math.min(1,  dx)) * TILT_DEG;

            card.style.transition = 'transform 0.08s ease-out';
            card.style.transform  =
                `perspective(${PERSPECTIVE}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${SCALE})`;
        };

        this._onMouseLeave = () => {
            // Spring back — longer duration, ease-out curve
            card.style.transition = 'transform 0.70s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform  = '';
        };

        banner.addEventListener('mousemove',  this._onMouseMove);
        banner.addEventListener('mouseleave', this._onMouseLeave);
    }

}