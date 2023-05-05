import { LightningElement,wire} from 'lwc';
import createNoteRecord from '@salesforce/apex/NoteTakingController.createNoteRecord';
import getNoteRecords from '@salesforce/apex/NoteTakingController.getNoteRecords';
import updateNoteRecord from '@salesforce/apex/NoteTakingController.updateNoteRecord';
import deleteNoteRecord from '@salesforce/apex/NoteTakingController.deleteNoteRecord';
import  {refreshApex} from '@salesforce/apex';
import LightningConfirm from 'lightning/confirm';
const DEFAULT_NOTE_FORM = {
    Name :"",
    Note_Description__c : ""
}
export default class NoteTakingApp extends LightningElement {
    noteList =[];
    showModal = false;
    wiredNoteResult
    noteRecord = DEFAULT_NOTE_FORM;
    selectedRecordId;
    allowedFormats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'indent',
        'align',
        'link',
        'image',
        'clean',
        'table',
        'header',
        'color',
        'background',
    ];


    @wire(getNoteRecords)
    noteListInfo(result){
      this.wiredNoteResult = result;
      const {data,error} = this.wiredNoteResult;
      if(data){
    console.log("data", JSON.parse(JSON.stringify(data)))

    this.noteList = data.map((item)=>{
     let formattedDate  = new Date(item.LastModifiedDate).toDateString();
    return {...item,formattedDate}
    })
      }
      if(error){
         console.error("error in fetching", error);
         this.showToastMsg(error.message.body,"error")
      }
    }
    get isFormInValid(){
        return  !(this.noteRecord && this.noteRecord.Note_Description__c && this.noteRecord.Name);
    }
    get ModalName(){
      return  this.selectedRecordId ? "Update Note" : "Add Note";
    }
    createNoteHandler(){
        this.showModal = true;
    }
    closeModalHandler(){
        this.noteRecord = DEFAULT_NOTE_FORM;
        this.showModal = false;
        this.selectedRecordId = null;
    }

    changeHandler(event){
     const {name,value} = event.target;
     this.noteRecord={...this.noteRecord,[name] : value};
     }

     formSubmitHandler(event){
      event.preventDefault();
      if(this.selectedRecordId){
        this.updateNoteHandler(this.selectedRecordId);
      }else{
        this.createNote();
      }
     
     }

     createNote(){
        createNoteRecord({noteRecord : this.noteRecord}).then(()=>{
            this.showModal = false;
            this.selectedRecordId = null;
            this.showToastMsg('Note created Successfully!!', "success")
            this.refresh();
          }).catch((error)=>{
            console.error("error", error.message.body);
            this.showToastMsg(error.message.body,"error")
          })
     }

     editNoteHandler(event){
          const {recordid} = event.target.dataset;
          const noteRecord = this.noteList.find((item)=> item.Id === recordid);
          this.noteRecord ={
            Name : noteRecord.Name,
            Note_Description__c : noteRecord.Note_Description__c
          }
          this.selectedRecordId = recordid;
          this.showModal = true;
     }

     updateNoteHandler(noteId){
      const {Name , Note_Description__c } = this.noteRecord
      updateNoteRecord({ noteId, title : Name, description : Note_Description__c})
      .then(()=>{
        this.showModal = false;
        this.selectedRecordId = null;
        this.noteRecord = DEFAULT_NOTE_FORM;
        this.showToastMsg('Note updated Successfully!!', "success");
        this.refresh();
      }).catch((error)=>{
        console.error("error while updating Note", error.message.body);
        this.showToastMsg(error.message.body,"error")
      })
     }


     deleteNoteHandler(event){
      this.selectedRecordId = event.target.dataset.recordid;
      this.handleConfirmClick();
     }

     async handleConfirmClick() {
      const result = await LightningConfirm.open({
          message: 'Are you sure you want to delete this note ?',
          variant: 'headerless',
          label: 'Delete Confirmation',
      });

      if(result){
        this.deleteHandler();
      }else{
        this.selectedRecordId = null;
      }
    }
      
    deleteHandler(){
      deleteNoteRecord({noteId :this.selectedRecordId}).then(()=>{
        this.showModal = false;
        this.selectedRecordId = null;
        this.showToastMsg('Note deleted Successfully!!', "warning");
        this.refresh();
       }).catch((error)=>{
        console.error("error while deleting Note", error.message.body);
        this.showToastMsg(error.message.body,"error");
       })
    }


     showToastMsg(message,variant){
      const notificationElement =  this.template.querySelector('c-note-taking-toast-comp');
      if(notificationElement){
        notificationElement.showToast(message,variant);
      }

     }


     refresh(){
      return refreshApex(this.wiredNoteResult);
     }
}