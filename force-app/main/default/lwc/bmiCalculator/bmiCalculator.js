import { LightningElement } from 'lwc';
export default class BmiCalculator extends LightningElement {
    height='';
    weight='';
    bmiValue='';
    result ='';

    inputHandler(event){
      const {name , value} = event.target;
    //   if(name == 'height'){
    //     this.height = value;
    //   }
    //   if(name='weight'){
    //     this.weight = value;
    //   }

    this[name]= value;
    }

    submitHandler(event){
     event.preventDefault();
     this.calculateBMI();
    }

    calculateBMI(){
        //BMI = Weight(Kg)/(Height * Height(m))
        let height = Number(this.height)/100;
        let weight = Number(this.weight);
        let bmi = weight / (height*height);
        this.bmiValue =Number(bmi.toFixed(2));

        if(this.bmiValue < 18.5){
            this.result = 'Underweight'
        }else if(this.bmiValue >= 18.5 && this.bmiValue < 25){
            this.result = 'Healthy'
        }else if(this.bmiValue >= 25 && this.bmiValue < 30){
            this.result = 'Overweight'
        }else{
            this.result = 'Obese'
        }
    }

    reCalculateHandler(){
        this.height='';
        this.weight='';
        this.bmiValue='';
        this.result ='';
    }
}