import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets'
export default class AlarmClockApp extends LightningElement {

    alarmImg = `${AlarmClockAssets}/AlarmClockAssets/clock.png`;
    ringtone = new Audio(`${AlarmClockAssets}/AlarmClockAssets/Clocksound.mp3`);
    currTime = "";
    selectedHour='';
    selectedMinute='';
    selectedMeridian='';
    alarmTime ='';
    hourOptions=[];
    minuteOptions=[];
    merdianOptions =["AM","PM"];
    isAlarmSet=false;
    isAlarmTriggered = false;
get isButtonDisabled(){
    return  !(this.selectedHour && this.selectedMinute && this.selectedMeridian); 
}
get shakeImage(){
    return this.isAlarmTriggered ? 'shake' : '';
}
    connectedCallback(){
        this.createHoursOptions();
        this.createMinutesOptions();
        this.getCurrentTime();
    }
    getCurrentTime(){

        setInterval(()=>{
            let dateTime = new Date();
            let hour = dateTime.getHours();
            let min = dateTime.getMinutes();
            let sec  = dateTime.getSeconds();
            let ampm = 'AM';
    
            if(hour == 0){
                hour = 12;
            }
            if(hour >= 12){
                hour = hour - 12;
                ampm = "PM"
            }
            hour = hour < 10 ? "0"+hour : hour;
            min = min <10 ? "0" + min : min;
            sec = sec < 10 ? "0"+ sec : sec;
    
            this.currTime = `${hour} : ${min} : ${sec} ${ampm}`
            if(this.alarmTime === `${hour} : ${min}  ${ampm}`){
                this.isAlarmTriggered = true;
                this.ringtone.play();
                this.ringtone.loop = true;
            }

        },1000)
       

    }

    createHoursOptions(){
   for(let i=1; i<=12;i++){
    let val = i<10 ? "0"+i : i;
   this.hourOptions = [val,...this.hourOptions];
   }
    }
    createMinutesOptions(){
        for(let i=0; i<=59;i++){
         let val = i<10 ? "0"+i : i;
        this.minuteOptions = [val,...this.minuteOptions];
        }
    }

    optionHandler(event){
        const{label,value} = event.detail;
        if(label === 'Hour(s)'){
        this.selectedHour = value;
        }else if(label ==='Minute(s)'){
        this.selectedMinute = value;
        }else if(label === 'AM/PM'){
        this.selectedMeridian = value;
        }else{}
    }

    setAlarmHandler(){
      let sec = "00"
      this.alarmTime = `${this.selectedHour} : ${this.selectedMinute}  ${this.selectedMeridian}`;
      this.isAlarmSet = true;
    }

    clearAlarmHandler(){
        this.alarmTime='';
        this.isAlarmSet=false;
        this.isAlarmTriggered = false;
        this.ringtone.pause();
        this.ringtone.loop = true;
        const elements = this.template.querySelectorAll('c-alarm-clock-drop-down');
        Array.from(elements).forEach((element)=>{
            element.reset('');
        })
    }

}