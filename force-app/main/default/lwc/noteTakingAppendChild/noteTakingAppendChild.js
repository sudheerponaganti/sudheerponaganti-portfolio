import { LightningElement,api} from 'lwc';

export default class NoteTakingAppendChild extends LightningElement {

_result;
isLoaded = false;
@api
get result(){
    return this._result
}
    set result(data){
        this._result = data;
        if(this.isloaded){
            this.attachHtml();
        }
    }
    
renderedCallback(){
    if(this._result && !this.isloaded){
        this.attachHtml();
    }
  
}

    attachHtml(){
        const container = this.template.querySelector('.html-container');
        container.innerHTML = this._result;
        this.isloaded = true;
    }
}