import { LightningElement,wire,api} from 'lwc';
import PortfolioAssetsZip from '@salesforce/resourceUrl/PortfolioAssets';
import sudheerProfileVideo from '@salesforce/resourceUrl/sudheerProfileVideo'
import AudioClickSoundsZip from '@salesforce/resourceUrl/AudioClickSoundsZip';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import FULLNAME_FIELD from '@salesforce/schema/Portfolio__c.FullName__c';
import DESIGNATION_FIELD from '@salesforce/schema/Portfolio__c.Designation__c';
import COMPANYNAME_FIELD from '@salesforce/schema/Portfolio__c.CompanyName__c';
import COMPANYLOCATION_FIELD from '@salesforce/schema/Portfolio__c.CompanyLocation__c';
export default class PortfolioBanner extends LightningElement {
    @api recordId //= 'a015i00000oQMndAAG';
    @api linkedinUrl // = "https://www.linkedin.com/in/ponaganti-sudheer-aa142a182/"
    @api twitterUrl  // =  "https://twitter.com/ponagantisudhe1"
    @api githubUrl  //  =  "https://github.com/sudheerponaganti"
    @api youtubeUrl  // =  "https://youtube.com"
    @api trailheadUrl // = "https://trailblazer.me/id/psudheer2"
    @api codepenUrl  // = "https://codepen.io/sudheerponaganti"
   profileVideo =`${sudheerProfileVideo}/sudheerProfileVideo.mp4` 
    
    /*@api socialMediaUrls ={
        linkedinUrl  : "https://www.linkedin.com/in/ponaganti-sudheer-aa142a182/",
        twitterUrl   : "https://twitter.com/ponagantisudhe1",
        githubUrl    : "https://github.com/sudheerponaganti",
        youtubeUrl   : "https://youtube.com",
        trailheadUrl : "https://trailblazer.me/id/psudheer2"
    } */
   connectedCallback(){
//     setTimeout(()=>{
//         const videoContainer = this.template.querySelector(".video-container");
//         const videoContainerImg  = this.template.querySelector(".video-container Img");
//         const videoContainerVideo = this.template.querySelector(".video-container video");
//         videoContainer.addEventListener("mouseover",()=>{
//              videoContainerImg.style.display = "none";
//              videoContainerVideo.style.display ="inline-block";
//              videoContainerVideo.play();
//         })
//         videoContainer.addEventListener("mouseleave",()=>{
//             videoContainerVideo.pause();
//             videoContainerVideo.style.display ="none";
//              videoContainerImg.style.display = "inline-block";
             
//         })
       


//         // const video = this.template.querySelector(".video-class");
//         // video.addEventListener("mouseover", ()=>{
//         //     video.play();
//         // })
//         // video.addEventListener("mouseleave", ()=>{
//         //     video.pause();
//         // })
// },0)
     
    }
    socialMediaIcons ={
        sudheerPic  :  `${PortfolioAssetsZip}/PortfolioAssets/sudheerPonagantiPic.jpg`,
        userPic     : `${PortfolioAssetsZip}/PortfolioAssets/userPic.jpeg`,
        linkedin    : `${PortfolioAssetsZip}/PortfolioAssets/Social/linkedin.svg`,
        github      : `${PortfolioAssetsZip}/PortfolioAssets/Social/github.svg`,
        trailhead   : `${PortfolioAssetsZip}/PortfolioAssets/Social/trailhead1.svg`,
        twitter     : `${PortfolioAssetsZip}/PortfolioAssets/Social/twitter.svg`,
        youtube     : `${PortfolioAssetsZip}/PortfolioAssets/Social/youtube.svg`,
        codepen     : `${PortfolioAssetsZip}/PortfolioAssets/Social/codepen.svg`,
        xTwitter   :  `${PortfolioAssetsZip}/PortfolioAssets/Social/x-twitter.svg`
    }
   
    @wire(getRecord, { recordId: '$recordId', fields: [FULLNAME_FIELD, DESIGNATION_FIELD,COMPANYNAME_FIELD,COMPANYLOCATION_FIELD] })
    portfolioData
  
    
    /* portfolioHandler({data,error}){
  if(data){
    console.log('record data =>', JSON.parse(JSON.stringify(data)))
  }
  if(error){
    console.error("error is =>", error)
  }
    } */

     get fullName() {
        return getFieldValue(this.portfolioData.data, FULLNAME_FIELD);
    }

    get designation() {
        return getFieldValue(this.portfolioData.data, DESIGNATION_FIELD);
    }

    get companyName(){
        return getFieldValue(this.portfolioData.data, COMPANYNAME_FIELD);
    }
    
    get companyLocation() {
        return getFieldValue(this.portfolioData.data, COMPANYLOCATION_FIELD);
    }

    // videoHandler(event){
    // event.target.pause();
    // }

    buttonSoundHandler(){
        const audio = new Audio();
        audio.src  = `${AudioClickSoundsZip}/audio-click-sounds/game-sound.mp3`;
        audio.play();
    }

}