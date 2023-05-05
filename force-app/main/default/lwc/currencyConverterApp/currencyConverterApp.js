import { LightningElement } from 'lwc';
import {countryCodeList} from  'c/countryCodeList';
import currencyConverterAssets from '@salesforce/resourceUrl/currencyConverterAssets'
export default class CurrencyConverterApp extends LightningElement {
     currencyImage = `${currencyConverterAssets}/currencyConverterAssets/currency.svg`;
     countryList = countryCodeList;
     countryFrom = "USD";
     countryTo = "AUD";
     conversionResult;
     conversionError;
     amount='';
     handleChangeCurrency(event){
      this.conversionError = '';
      this.conversionResult ='';
        const {name,value} = event.target;
        this[name]= value;
     }

     submitHandler(event){
      event.preventDefault();
      this.convert();

     }

     async convert(){
      const API_URL = `https://api.exchangerate.host/convert?from=${this.countryFrom}&to=${this.countryTo}`

      /***** AJAX *****/
      // let xhr = new XMLHttpRequest(); 
      // xhr.open('GET',API_URL);
      // xhr.responseType = 'json';
      // xhr.send();

      // xhr.onload= ()=>{
      //    if(xhr.status == 200){
      //       let response = xhr.response;
      //       this.conversionResult = (Number(this.amount)*response.result).toFixed(2);
      //    }else{
      //       this.conversionError = 'An error occured Please Try again...';
      //    }
      
      // }


     /****FETCH Promise Method *****/

   //   fetch(API_URL).then((data)=>{
   //    return data.json();
   //   }).then((response)=>{
   //   this.conversionResult = (Number(this.amount)*response.result).toFixed(2);
   //   }).catch((error)=>{
   //   this.conversionError = 'An error occured Please Try again...';
   //   })

     /****FETCH Async/Await****/

     try{
      let data = await fetch(API_URL);
      let response = await data.json();
      this.conversionResult = (Number(this.amount)*response.result).toFixed(2);
     }catch(error){
      this.conversionError = 'An error occured Please Try again...';
     }


      }

} 