import { LightningElement } from 'lwc';
import WEATHER_ICONS from '@salesforce/resourceUrl/weatherAppIcons';
import getWeatherDetails from '@salesforce/apex/WeatherAppController.getWeatherDetails';
const API_KEY = '76b71938f722556117ceca7348773630';
export default class WeatherApp extends LightningElement {
  clearIcon = `${WEATHER_ICONS}/weatherAppIcons/clear.svg`
  cloudIcon = `${WEATHER_ICONS}/weatherAppIcons/cloud.svg`
  dropletIcon = `${WEATHER_ICONS}/weatherAppIcons/droplet.svg`
  hazeIcon = `${WEATHER_ICONS}/weatherAppIcons/haze.svg`
  mapIcon = `${WEATHER_ICONS}/weatherAppIcons/map.svg`
  rainIcon = `${WEATHER_ICONS}/weatherAppIcons/rain.svg`
  snowIcon = `${WEATHER_ICONS}/weatherAppIcons/snow.svg`
  stormIcon = `${WEATHER_ICONS}/weatherAppIcons/storm.svg`
  thermometerIcon = `${WEATHER_ICONS}/weatherAppIcons/thermometer.svg`
  arrowBackIcon = `${WEATHER_ICONS}/weatherAppIcons/arrow-back.svg`
  weatherResponse;
  cityName='';
  loadingText='';
  isInvalidName = false;
  weatherIcon;

  get isLoadingTextClass(){
    return this.loadingText ? this.loadingText === 'Fetching weather details.....' ? 'success-class' : 'error-class' : '';
  }
    searchHandler(event){
 this.cityName = event.target.value;
    }

    submitHandler(event){
        event.preventDefault();
        this.fetchWeatherData();
    }

     fetchWeatherData(){
        this.loadingText = 'Fetching weather details.....';

        /***Client Side Callout *****/


    //     const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&appid=${API_KEY}`;
    //      fetch(url)
    //     .then((response)=>{
    //       return response.json();
    //     })
    //     .then((result)=>{
    //         console.log(result);
    //         this.weatherDetails(result);
    //     }).catch((error)=>{
    //         this.loadingText= 'Something went wrong....'
    //         console.error('error is==>',error)
    //     })

/******Server Side Callout ******/
    getWeatherDetails({input : this.cityName}).then((response)=>{
      console.log(response);
      this.weatherDetails(response);
    }).catch((error)=>{
      this.loadingText= 'Something went wrong....'
      console.log(error)
    })


    }


    weatherDetails(info){
        if(info.cod === '404'){
            this.loadingText = `${this.cityName} is not a valid city name`;
            this.isInvalidName = true;
        }else{
            this.loadingText = ''
            const city = info.name;
            const country = info.sys.country;
            const{description, id} = info.weather[0];
            const {temp,feels_like,humidity} = info.main;

            if(id === 800){
              this.weatherIcon = this.clearIcon
            }else if(id>=801 && id <= 804){
              this.weatherIcon = this.cloudIcon;
            }else if(id>= 701 && id <= 781){
              this.weatherIcon = this.hazeIcon
            }else if(id>= 600 && id <= 622){
              this.weatherIcon = this.snowIcon
            }else if(id>=500 && id <= 531){
              this.weatherIcon = this.rainIcon;
            }else if(id>=300 && id <= 321){
              this.weatherIcon = this.stormIcon;
            }else if(id>= 200 && id <= 232){
              this.weatherIcon = this.stormIcon
            }else{
            }

            this.weatherResponse={
              city,
              description,
              temperature : Math.floor(temp),
              location : `${city}, ${country}`,
              feels_like : Math.floor(feels_like),
              humidity : `${humidity}%`
            }
        }
    } 

    resetHandler(){
      this.cityName='';
      this.loadingText='';
      this.isInvalidName = false;
      this.weatherResponse ='';
      this.weatherIcon='';
    }

    colorChangeHandler(){
      if( this.template.querySelector('.black')){
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        this.template.querySelector('.black').classList.remove('black')
        this.template.querySelector('.weather-app').style.background = "#" + randomColor;
      }else{
        this.template.querySelector('.weather-app').classList.add('black');
        this.template.querySelector('.black').style.background = "#000000";
        
      }

    }
} 