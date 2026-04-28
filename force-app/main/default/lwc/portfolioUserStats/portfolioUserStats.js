import { LightningElement, api } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets';

export default class PortfolioUserStats extends LightningElement {

    /* ── Public API props ───────────────────────────────────────── */
    @api badges;
    @api points;
    @api trails;
    @api rank;

    /* ── Internal state ─────────────────────────────────────────── */
    trailheadRankImg;

    _initialized       = false;   // guard against renderedCallback re-fires
    _observer          = null;    // IntersectionObserver — triggers count-up
    _activeRAFs        = [];      // running requestAnimationFrame IDs for cleanup
    _reducedMotion     = false;   // cached prefers-reduced-motion result

    /* ── Lifecycle ──────────────────────────────────────────────── */
    renderedCallback() {
        // Build rank image URL once rank prop is available
        if (this.rank && !this.trailheadRankImg) {
            this.trailheadRankImg = `${PortfolioAssets}/PortfolioAssets/Ranks/${this.rank}.png`;
        }

        // All subsequent setup runs once only
        if (this._initialized) return;
        this._initialized = true;

        this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this._applyLargeNumberClass();
        this._setupIntersectionObserver();
    }

    disconnectedCallback() {
        // Cancel all running counter animations
        this._activeRAFs.forEach(id => cancelAnimationFrame(id));
        this._activeRAFs = [];

        // Disconnect the IntersectionObserver
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }

    /* ── Large number class ─────────────────────────────────────── */
    /**
     * Numbers with 5+ digits step down font size so they fit the card.
     * data-target may arrive with comma separators (e.g. "109,925") —
     * strip them before parsing so parseInt reads the full value.
     *   5 digits (10,000–99,999)  → stat-number--large  (28px)
     *   6+ digits (100,000+)      → stat-number--xlarge (22px)
     */
    _applyLargeNumberClass() {
        const numbers = this.template.querySelectorAll('.stat-number');
        numbers.forEach(el => {
            // Strip locale commas before parsing — "109,925" → 109925
            const cleaned = (el.dataset.target || '0').replace(/,/g, '');
            const raw = parseInt(cleaned, 10);
            if (raw >= 100000) {
                el.classList.add('stat-number--xlarge');
            } else if (raw >= 10000) {
                el.classList.add('stat-number--large');
            }
        });
    }

    /* ── IntersectionObserver — scroll-triggered card entrances ── */
    /**
     * Each stat card is observed individually. When it enters the
     * viewport, we add .stat-card--visible which triggers the CSS
     * transition (opacity + translateY → 0). The count-up counter
     * starts after the entrance transition completes.
     *
     * Stagger is handled by --card-delay CSS custom property on each
     * card class, so no JS timing coordination is needed.
     */
    _setupIntersectionObserver() {
        const section = this.template.querySelector('.stats-section');
        if (!section) return;

        // If reduced motion, show everything immediately
        if (this._reducedMotion) {
            const cards = this.template.querySelectorAll('.stat-card');
            cards.forEach(card => card.classList.add('stat-card--visible'));
            this._showFinalValues();
            return;
        }

        let countersStarted = false;

        this._observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Reveal this card — CSS transition handles the animation
                        entry.target.classList.add('stat-card--visible');

                        // Stop observing this card once revealed
                        this._observer.unobserve(entry.target);

                        // Start count-up counters once — after entrance completes
                        // Entrance is 750ms + up to 270ms stagger = ~1020ms total
                        if (!countersStarted) {
                            countersStarted = true;
                            // eslint-disable-next-line @lwc/lwc/no-async-operation
                            setTimeout(() => {
                                this._startAllCounters();
                            }, 1050);
                        }
                    }
                });
            },
            {
                // Fire when 15% of each card enters viewport — catches early enough
                // on mobile where cards are tall relative to viewport
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        // Observe each card individually for per-card staggered entrance
        const cards = this.template.querySelectorAll('.stat-card');
        cards.forEach(card => this._observer.observe(card));
    }

    /* ── Show final values immediately (reduced motion / fallback) ─ */
    _showFinalValues() {
        const numbers = this.template.querySelectorAll('.stat-number');
        numbers.forEach(el => {
            // Strip commas before parsing — handles inputs like "109,925"
            const cleaned = (el.dataset.target || '0').replace(/,/g, '');
            const target = parseInt(cleaned, 10);
            el.textContent = this._formatNumber(el.dataset.type, target);
        });
    }

    /* ── Start all stat counters ────────────────────────────────── */
    _startAllCounters() {
        const numbers = this.template.querySelectorAll('.stat-number');
        numbers.forEach(el => {
            // Strip commas before parsing — handles inputs like "109,925"
            const cleaned = (el.dataset.target || '0').replace(/,/g, '');
            const target = parseInt(cleaned, 10);
            if (!isNaN(target) && target > 0) {
                this._animateCounter(el, target);
            }
        });
    }

    /* ── Animated count-up counter ──────────────────────────────── */
    /**
     * Counts from 0 to targetValue over `duration` milliseconds.
     *
     * Uses quartic ease-out: `1 - (1 - t)^4`
     * — fastest at the start (races through low numbers quickly, feels right)
     * — long deceleration tail (spends more frames near the final value,
     *   the number visibly "settles" on its target)
     *
     * `font-variant-numeric: tabular-nums` in CSS prevents layout jitter.
     *
     * @param {HTMLElement} element   - The .stat-number DOM element
     * @param {number}      target    - Final integer value
     * @param {number}      duration  - Total animation duration in ms (default 1800)
     */
    _animateCounter(element, target, duration = 1800) {
        const startTime = performance.now();

        // Quartic ease-out — polynomial approximation of cubic-bezier(0.16, 1, 0.3, 1)
        // Fast initial burst + long deceleration tail as value approaches target
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        // currentRafId is shared across frames so each tick can schedule the next
        // and disconnectedCallback can cancel the last scheduled frame
        let currentRafId;

        const tick = (currentTime) => {
            const elapsed  = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = easeOutQuart(progress);
            const current  = Math.round(eased * target);

            element.textContent = this._formatNumber(element.dataset.type, current);

            if (progress < 1) {
                currentRafId = requestAnimationFrame(tick);
                // Replace old ID with updated ID in the tracking array
                this._activeRAFs = this._activeRAFs.map(id => (id === currentRafId ? currentRafId : id));
            } else {
                // Ensure exact final value — no rounding drift at boundary
                element.textContent = this._formatNumber(element.dataset.type, target);
                // Remove completed RAF from tracking array
                this._activeRAFs = this._activeRAFs.filter(id => id !== currentRafId);
            }
        };

        currentRafId = requestAnimationFrame(tick);
        this._activeRAFs.push(currentRafId);
    }

    /* ── Number formatting ──────────────────────────────────────── */
    /**
     * Points use locale-aware comma formatting (e.g. 148,000).
     * Badges and Trails are small integers — no separator needed.
     */
    _formatNumber(type, value) {
        if (type === 'points') {
            return value.toLocaleString();
        }
        return String(value);
    }
}