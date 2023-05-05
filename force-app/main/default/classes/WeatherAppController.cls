public with sharing class WeatherAppController {
    @AuraEnabled
    public static Map<String, Object> getWeatherDetails(String input){
     
        String url = 'https://api.openweathermap.org/data/2.5/weather?q='+ input +'&units=metric'+getKey();
        try {
            HttpResponse response = getResponse(url);
             Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            System.debug(results);
           return results;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
private static HttpResponse getResponse(String url){
Http http = new Http();
HttpRequest request = new HttpRequest();
HttpResponse res = new HttpResponse();
request.setMethod('GET');
request.setEndpoint(url);
request.setTimeout(120000);
res= http.send(request);
  //Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
    return res;
}


 private static String  getkey(){
   String  key = '76b71938f722556117ceca7348773630';
   String keyParam = '&appid='+key;
   return keyParam;
    }
}