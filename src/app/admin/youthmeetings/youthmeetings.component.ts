import { Component, OnInit, ViewChild } from '@angular/core';
import { NameBoxComponent } from '../dialog/name-box/name-box.component';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroupDirective } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Meeting } from 'src/app/model/Meeting';
import { MeetingDatatableComponent } from './datatable/datatable.component';
import { SpinnerOverlayServiceService } from 'src/app/spinner-overlay-service.service';
import { NameModel } from '../model/NameModel';

@Component({
  selector: 'app-youthmeetings',
  templateUrl: './youthmeetings.component.html',
  styleUrls: ['./youthmeetings.component.css']
})
export class YouthmeetingsComponent implements OnInit {

  uniqueId="";
  crudFlag="";
  saveUP=false;
  dialogNames: NameModel[] = [];
  selectedMocNames: NameModel[] = [];
  selectedMusiciansNames: NameModel[] = [];
  selectedArrangeNames: NameModel[] = [];
  selectedSingersNames: NameModel[] = [];
  selectedWorshipersNames: NameModel[] = [];
  selectedTestimonyNames: NameModel[] = [];
  selectedWogNames: NameModel[] = [];
  selectedOthersNames: NameModel[]=[];
  selectedPicsNames: picsModel[];
  updatePicsNames: picsModel[];
  meetingsForm: FormGroup;
  fileList: File[];
  fileName: string;
  deletedPicsUrl=[];

  actionButtonLabel: string = 'Ok';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild(MeetingDatatableComponent, { static: true }) child: MeetingDatatableComponent;
  @ViewChild(FormGroupDirective, { static: true }) form: FormGroupDirective

  constructor(public dialog: MatDialog, private adminService: AdminService, private formBuilder: FormBuilder,
    private spinnerService: SpinnerOverlayServiceService, public snackBar: MatSnackBar) { }

  
  ngOnInit() {
    this.meetingsForm = this.formBuilder.group({
      date: ['', Validators.required],
      aboutOthers: ['', [this.checkIfAboutAvailable(), Validators.maxLength(200)]],
      songs: ['', [this.checkIfSongsAvailable(), Validators.maxLength(200)]],
      aboutWog: ['', [this.checkIfWogAvailable(), Validators.maxLength(200)]],
      remarks:['', Validators.maxLength(200)]
    });

    this.adminService.getProfiles().subscribe(data => {

      let value: NameModel = {
        name: "All",
        uniqueId: "1000"
      }
      this.dialogNames.push(value)

      data.forEach(f => {
        let value: NameModel = {
          name: f.name,
          uniqueId: f.uniqueId
        }
        this.dialogNames.push(value)
      })
    });

    this.meetingsForm.get('date').setValue(formatDate(new Date, 'yyyy-MM-dd', 'en'));
    this.fileList=[];
    this.selectedPicsNames=[];
    this.updatePicsNames=[];
  }

  
  checkIfAboutAvailable(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value =="" && this.selectedOthersNames.length>=1 ) {
         return Validators.required(control);
      }
      return null;
    };
  }
  checkIfSongsAvailable(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value =="" && this.selectedSingersNames.length>=1 ) {          
           return Validators.required(control);
        }
        return null;
      };
    }

    checkIfWogAvailable(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (control.value =="" && this.selectedWogNames.length>=1 ) {          
             return Validators.required(control);
          }
          return null;
        };
      }

  onSave(): void {
    
    if (this.meetingsForm.invalid) {
      console.log("form vali")
      return;
    }

    if(this.crudFlag == "delete") {
      this.crudFlag="";
      return
    }
    this.spinnerService.show();
    let meeting = <Meeting>  {
      date: formatDate(this.meetingsForm.get('date').value, 'yyyy-MM-dd', 'en'),
      moc: this.selectedMocNames.map(f=>f.uniqueId),
      mocModel: this.selectedMocNames,
      arrangements: this.selectedArrangeNames.map(f=>f.uniqueId),
      arrangementsModel: this.selectedArrangeNames,
      worshipers: this.selectedWorshipersNames.map(f=>f.uniqueId),
      worshipersModel: this.selectedWorshipersNames,
      musicians: this.selectedMusiciansNames.map(f=>f.uniqueId),
      musiciansModel: this.selectedMusiciansNames,
      singers: this.selectedSingersNames.map(f=>f.uniqueId),
      singersModel: this.selectedSingersNames,
      songs: this.meetingsForm.get('songs').value,
      testimony: this.selectedTestimonyNames.map(f=>f.uniqueId),
      testimonyModel: this.selectedTestimonyNames,
      wog: this.selectedWogNames.map(f=>f.uniqueId),
      wogModel: this.selectedWogNames,
      aboutWog: this.meetingsForm.get('aboutWog').value,
      others: this.selectedOthersNames.map(f=>f.uniqueId),
      othersModel: this.selectedOthersNames,
      othersAbout: this.meetingsForm.get('aboutOthers').value,
      remarks: this.meetingsForm.get('remarks').value,
    }
    meeting.picsUrl = [];
    if (this.saveUP == true) {
      return this.onUpdate(meeting);
    } 
    
    let files=[]
    this.selectedPicsNames.forEach(f=>{
      files.push(f.file);
    })

    this.adminService.createMeeting(meeting, files)
    .subscribe(data=> {
      let jsonData= JSON.parse(data);
      meeting.uniqueId = jsonData.uniqueId
      let listsOfUrl = jsonData.picsUrl
      listsOfUrl.forEach(url=>{
        meeting.picsUrl.push(url)
      })
      this.child.saveRowValues(meeting)
      this.onReset();
      this.spinnerService.hide();
      this.successSnackBar("Details Saved Succesfully !");
    })

  }

  onUpdate(meeting): void {
    console.log("update here")
    let files =[]
    for(let i=0;i<this.selectedPicsNames.length;i++) {
      if(this.selectedPicsNames[i].file!= null) {
        files.push(this.selectedPicsNames[i].file);
      } else {
        meeting.picsUrl.push(this.selectedPicsNames[i].url)
      }
    }    

    this.adminService.updateMeeting(meeting, files, this.uniqueId, this.deletedPicsUrl)
      .subscribe(data => {
        if(data!=null && data!=undefined && data!="") {
          let ListsOfUrl =JSON.parse(data)
          ListsOfUrl.forEach(url=> {
            meeting.picsUrl.push(url);
          })
        }
        this.child.UpdateRowValues(meeting, this.uniqueId)
        this.onReset();
        this.spinnerService.hide();
        this.successSnackBar("Details updated Succesfully !");
      })
  }

  onReset(): void {

    this.saveUP = false;
    this.uniqueId = "";
    this.form.resetForm();
    this.meetingsForm.get('date').setValue(formatDate(new Date, 'yyyy-MM-dd', 'en'));
    this.clearFields();
  }

  clearFields(): void {
    this.selectedMocNames = [];
    this.selectedMusiciansNames = [];
    this.selectedArrangeNames = [];
    this.selectedSingersNames = [];
    this.selectedWorshipersNames = [];
    this.selectedTestimonyNames = [];
    this.selectedWogNames = [];
    this.selectedOthersNames=[];
    this.selectedPicsNames = [];
    this.updatePicsNames = [];
    this.deletedPicsUrl=[];
  }

  onDeleteRows(): void {
    this.crudFlag = "delete";
    if (this.uniqueId.length > 0) {
    this.spinnerService.show();
     let picsToBeDeleted = this.child.getListOfPicsUrl(this.uniqueId);
     let picstoBedelete: string[] = [];
     if(picsToBeDeleted!=null) {
      picsToBeDeleted.forEach(url=>{
        picstoBedelete.push(url);
       })
     }
     
      this.adminService.deleteMeeting(this.uniqueId, picstoBedelete)
        .subscribe(data => {
          this.child.deleteRowValues(this.uniqueId)
          this.onReset();
          this.spinnerService.hide();
          this.successSnackBar("Details deleted Succesfully !");
        })
    }
  }

  public errorHandling = (control: string, error: string) => {
    return this.meetingsForm.controls[control].hasError(error);
  }

  additionalFormValidation() {
    if(
      ((this.selectedOthersNames==null || this.selectedOthersNames.length<=0) && 
      (this.meetingsForm.get('aboutOthers').value!=null && this.meetingsForm.get('aboutOthers').value.length>0 )) 
    || ((this.selectedWogNames==null || this.selectedWogNames.length<=0) && 
        (this.meetingsForm.get('aboutWog').value!=null && this.meetingsForm.get('aboutWog').value.length>0))
    || ((this.selectedSingersNames==null || this.selectedSingersNames.length<=0) && 
        (this.meetingsForm.get('songs').value!=null && this.meetingsForm.get('songs').value.length>0 )) ) {
      return true;
    }
    return false;
  }

  onPicsSelect(evt: any): void {
    if(this.selectedPicsNames.length >=3){
      return 
    }
    const file = evt.target.files[0];

    if (file) {
      let picsModel : picsModel= {
        name: file.name,
        url: URL.createObjectURL(file),
        file: file
      }
      this.updatePicsNames.push(picsModel);
      this.addToOrRemoveFromSelectedList('add', 'pics', picsModel);
    }
  }

  onOpenClick(index) {
    window.open(this.selectedPicsNames[index].url)
  }

  onSelectName(tag): void {
    
    const dialogRef = this.dialog.open(NameBoxComponent, {
      width: "300px",
      height: "500px",
      data: { name: this.dialogNames },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      if(result!=null) {
      result.forEach(element => {
        this.addToOrRemoveFromSelectedList('add', tag, element);
        
      });
    }
    });
  }

  clearNames(index, tag): void {
    console.log('on delete ' + index)
    this.addToOrRemoveFromSelectedList('remove', tag, index);
  }

  addToOrRemoveFromSelectedList(flag, tag, element): void {
    if (flag == "add") {
      if (tag == "moc") {
        if(!this.selectedMocNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedMocNames.push(element);
        }        
      } else if (tag == "musicians") {
        if(!this.selectedMusiciansNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedMusiciansNames.push(element);
        }        
      } else if (tag == "arrange") {
        if(!this.selectedArrangeNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedArrangeNames.push(element);
        }
      } else if (tag == "songs") {
        if(!this.selectedSingersNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedSingersNames.push(element);
          this.meetingsForm.get(tag).updateValueAndValidity();
        }                
      } else if (tag == "worshipers") {
        if(!this.selectedWorshipersNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedWorshipersNames.push(element);
        }
      } else if (tag == "testimony") {
        if(!this.selectedTestimonyNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedTestimonyNames.push(element);
        }
      } else if (tag == "aboutWog") {
        if(!this.selectedWogNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedWogNames.push(element);
          this.meetingsForm.get(tag).updateValueAndValidity();
        }       
      } else if (tag == "aboutOthers") {
        if(!this.selectedOthersNames.map(f=>f.uniqueId).includes(element.uniqueId)){
          this.selectedOthersNames.push(element);
          this.meetingsForm.get(tag).updateValueAndValidity();
        }        
      } else if (tag == "pics") {
        this.selectedPicsNames.push(element);
      }
    } else if (flag == "remove") {
      if (tag == "moc") {
        this.selectedMocNames.splice(element, 1);
      } else if (tag == "musicians") {
        this.selectedMusiciansNames.splice(element, 1);
      } else if (tag == "arrange") {
        this.selectedArrangeNames.splice(element, 1);
      } else if (tag == "songs") {
        this.selectedSingersNames.splice(element, 1);
        this.meetingsForm.get(tag).updateValueAndValidity();
      } else if (tag == "worshipers") {
        this.selectedWorshipersNames.splice(element, 1);
      } else if (tag == "testimony") {
        this.selectedTestimonyNames.splice(element, 1);
      } else if (tag == "aboutWog") {
        this.selectedWogNames.splice(element, 1);
        this.meetingsForm.get(tag).updateValueAndValidity();
      } else if (tag == "aboutOthers") {
        this.selectedOthersNames.splice(element, 1);
        this.meetingsForm.get(tag).updateValueAndValidity();
      } else if (tag == "pics") {
        if(this.selectedPicsNames[element].file==null) {
          this.deletedPicsUrl.push(this.selectedPicsNames[element].url)
        }
        this.selectedPicsNames.splice(element, 1);
      }
    }
  }

  selectRowValue(meeting: Meeting) {
    this.clearFields();
    this.meetingsForm.controls.date.setValue(formatDate(meeting.date, 'yyyy-MM-dd', 'en'));
    if(this.isArrayNotEmpty(meeting.mocModel)) {
      meeting.mocModel.forEach(moc=>this.selectedMocNames.push(moc));
    }
    if(this.isArrayNotEmpty(meeting.arrangementsModel)) {
      meeting.arrangementsModel.forEach(arrangements=>this.selectedArrangeNames.push(arrangements));
    }    
    if(this.isArrayNotEmpty(meeting.worshipersModel)) {
      meeting.worshipersModel.forEach(worshipers=>this.selectedWorshipersNames.push(worshipers));
    }
    if(this.isArrayNotEmpty(meeting.musiciansModel)) {
      meeting.musiciansModel.forEach(musicians=>this.selectedMusiciansNames.push(musicians));
    }
    if(this.isArrayNotEmpty(meeting.singersModel)) {
      meeting.singersModel.forEach(singers=>this.selectedSingersNames.push(singers));
    }    
    this.meetingsForm.controls.songs.setValue(meeting.songs)
    if(this.isArrayNotEmpty(meeting.testimonyModel)) {
      meeting.testimonyModel.forEach(testimony=>this.selectedTestimonyNames.push(testimony));
    }
    if(this.isArrayNotEmpty(meeting.wogModel)) {
      meeting.wogModel.forEach(wog=>this.selectedWogNames.push(wog));
    }
    this.meetingsForm.controls.aboutWog.setValue(meeting.aboutWog)
    if(this.isArrayNotEmpty(meeting.othersModel)) {
      meeting.othersModel.forEach(others=>this.selectedOthersNames.push(others));
    }
    this.meetingsForm.controls.aboutOthers.setValue(meeting.othersAbout)
    this.meetingsForm.controls.remarks.setValue(meeting.remarks)
    if(meeting.picsUrl!=null) {
      for(let i=0;i<meeting.picsUrl.length;i++) {
        const name = meeting.picsUrl[i].split('%2F')[2].split('?')[0].replace('%20',' ')
        let picsModel = <picsModel> {
          name: name,
          url: meeting.picsUrl[i]
        }
        this.selectedPicsNames.push(picsModel)
      }
     } 
     else {
      this.selectedPicsNames=[];
    }
    
    
    this.saveUP = true;
    this.uniqueId = meeting.uniqueId;
  }

  isArrayNotEmpty(value: any): boolean {
    if(value!=null && value.length>0) {
      return true;
    } else {
      return false;
    }
  }

  successSnackBar(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    config.panelClass = ['success-snapbar']
    this.snackBar.open(message, this.action ? this.actionButtonLabel : undefined, config);
  }

}



export class picsModel {
  name: string
  url: string
  file: any
}

export class urlValidator {
  static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
    if((control.value as string).indexOf(' ') >= 0){
        return {cannotContainSpace: true}
    }

    return null;
}
}
