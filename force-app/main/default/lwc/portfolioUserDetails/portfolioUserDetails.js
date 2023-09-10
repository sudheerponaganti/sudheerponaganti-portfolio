import { LightningElement,api} from 'lwc';
import AudioClickSoundsZip from '@salesforce/resourceUrl/AudioClickSoundsZip';
export default class PortfolioUserDetails extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api resumeUrl
    downloadResume(){
        const audio = new Audio();
        audio.src  = `${AudioClickSoundsZip}/audio-click-sounds/quick-switch-sound.wav`;
        audio.play();
        window.open(this.resumeUrl,"_blank")
    }
    // "https://github.com/sudheerponaganti/sudheer-ponaganti-resume/raw/main/Sudheer%20Ponaganti%20Resume.pdf"
}