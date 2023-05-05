import { LightningElement } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
export default class PortfolioPersonalProjects extends LightningElement {
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
    ]

}