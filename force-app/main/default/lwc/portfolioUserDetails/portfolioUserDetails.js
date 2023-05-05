import { LightningElement,api} from 'lwc';

export default class PortfolioUserDetails extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api resumeUrl
    downloadResume(){
     window.open(this.resumeUrl,"_blank")
    }
    // "https://github.com/sudheerponaganti/sudheer-ponaganti-resume/raw/main/Sudheer%20Ponaganti%20Resume.pdf"
}