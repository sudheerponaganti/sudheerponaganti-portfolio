import { LightningElement,api} from 'lwc';

export default class AlarmClockDropDown extends LightningElement {

    @api options =[];
    @api optionsLabel ='';
    @api optionId='';

    changeHandler(event){
       let val = event.target.value;
       this.callParent(val)
    }

    callParent(value){
        let evt = new CustomEvent('optionhandler',{
            detail : {
                label : this.optionsLabel,
                value
            }
        })
        this.dispatchEvent(evt);
    }


    @api reset(value){
        this.template.querySelector('select').value = value;
        this.callParent(value);
    }
}