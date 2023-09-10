import { LightningElement,api} from 'lwc';
import AudioClickSoundsZip from '@salesforce/resourceUrl/AudioClickSoundsZip';
export default class PortfolioTabsWrapper extends LightningElement {
    @api recordId
    @api objectApiName

    buttonClickHandler(){
    //     const audio = new Audio();
    //     audio.src  = `${AudioClickSoundsZip}/audio-click-sounds/negative-tone-sound.wav`;
    //     audio.play();
    }
}