import { LightningElement } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
import AudioClickSoundsZip from '@salesforce/resourceUrl/AudioClickSoundsZip';
export default class PortfolioPersonalProjects extends LightningElement {

    _focusObserver = null;
    _scaleInitialized = false;
    BMICalculator = `${PortfolioAssets}/PortfolioAssets/Projects/BMICalculator.png`
    AlarmClock = `${PortfolioAssets}/PortfolioAssets/Projects/AlarmClock.png`
    CurrencyCalculator = `${PortfolioAssets}/PortfolioAssets/Projects/CurrencyCalculator.png`
    NoteTakingApp = `${PortfolioAssets}/PortfolioAssets/Projects/NoteTakingApp.png`
    WeatherApp = `${PortfolioAssets}/PortfolioAssets/Projects/WeatherApp.png`
    Survey = `${PortfolioAssets}/PortfolioAssets/Projects/Survey.png`

    projects=[
        {
            "name": "BMI Calculator App",
             "img":this.BMICalculator,
             "link":"https://ponaganti-sudheer-dev-ed.trailblaze.my.site.com/bmi-calculator"
        },
        {
            "name": "Alarm Clock App",
             "img":this.AlarmClock,
             "link":"https://ponaganti-sudheer-dev-ed.trailblaze.my.site.com/alarm-clock"
        },
        {
            "name": "Currency Converter App",
             "img":this.CurrencyCalculator,
             "link":"https://ponaganti-sudheer-dev-ed.trailblaze.my.site.com/currency-converter"
        },
        {
            "name": "Weather App",
             "img":this.WeatherApp,
             "link":"https://ponaganti-sudheer-dev-ed.trailblaze.my.site.com/weather-app"
        },
        {
            "name": "Employee Survey App",
             "img":this.Survey,
             "link":"https://ponaganti-sudheer-dev-ed.trailblaze.my.site.com/survey/survey/runtimeApp.app?invitationId=0Ki5i0000019TH6&surveyName=employee_survey&UUID=d8b3218d-c305-4c05-80c4-111350494620"
        },
        {
            "name": "Note Taking App",
             "img":this.NoteTakingApp,
             "link":"https://ponaganti-sudheer-dev-ed.trailblaze.my.site.com/note-taking-app"
        }
    ];

    renderedCallback() {
        if (this._scaleInitialized) return;
        const cards = this.template.querySelectorAll('.card');
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
            { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
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

    alarmSoundHandler(event) {
        const name = event.currentTarget.dataset.name;
        if (name === 'Alarm Clock App') {
            const audio = new Audio();
            audio.src = `${AudioClickSoundsZip}/audio-click-sounds/interface-sound.mp3`;
            audio.play();
        }
    }

}