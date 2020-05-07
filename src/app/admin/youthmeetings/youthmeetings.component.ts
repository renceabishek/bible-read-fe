import { Component, OnInit, ViewChild } from '@angular/core';
import { NameBoxComponent } from '../dialog/name-box/name-box.component';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroupDirective } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Meeting } from 'src/app/model/Meeting';
import { MeetingDatatableComponent } from './datatable/datatable.component';
import { SpinnerOverlayServiceService } from 'src/app/spinner-overlay-service.service';

@Component({
  selector: 'app-youthmeetings',
  templateUrl: './youthmeetings.component.html',
  styleUrls: ['./youthmeetings.component.css']
})
export class YouthmeetingsComponent implements OnInit {

  uniqueId="";
  crudFlag="";
  saveUP=false;
  dialogNames = [];
  selectedMocNames = [];
  selectedMusiciansNames = [];
  selectedArrangeNames = [];
  selectedSingersNames = [];
  selectedWorshipersNames = [];
  selectedTestimonyNames = [];
  selectedWogNames = [];
  selectedOthersNames=[];
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
        name: "All"
      }
      this.dialogNames.push(value)

      data.forEach(f => {
        let value: NameModel = {
          name: f.name
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
      moc: this.selectedMocNames,
      arrangements: this.selectedArrangeNames,
      worshipers: this.selectedWorshipersNames,
      musicians: this.selectedMusiciansNames,
      singers: this.selectedSingersNames,
      songs: this.meetingsForm.get('songs').value,
      testimony: this.selectedTestimonyNames,
      wog: this.selectedWogNames,
      aboutWog: this.meetingsForm.get('aboutWog').value,
      others: this.selectedOthersNames,
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
        this.addToOrRemoveFromSelectedList('add', tag, element.name);
        
      });
    }
    });
  }

  clearNames(index, tag): void {
    console.log('on delete ' + index)
    this.addToOrRemoveFromSelectedList('remove', tag, index);
  }

  addToOrRemoveFromSelectedList(flag, tag, name): void {
    if (flag == "add") {
      if (tag == "moc") {
        if(!this.selectedMocNames.includes(name)){
          this.selectedMocNames.push(name);
        }        
      } else if (tag == "musicians") {
        if(!this.selectedMusiciansNames.includes(name)){
          this.selectedMusiciansNames.push(name);
        }        
      } else if (tag == "arrange") {
        if(!this.selectedArrangeNames.includes(name)){
          this.selectedArrangeNames.push(name);
        }
      } else if (tag == "songs") {
        if(!this.selectedSingersNames.includes(name)){
          this.selectedSingersNames.push(name);
          this.meetingsForm.get(tag).updateValueAndValidity();
        }                
      } else if (tag == "worshipers") {
        if(!this.selectedWorshipersNames.includes(name)){
          this.selectedWorshipersNames.push(name);
        }
      } else if (tag == "testimony") {
        if(!this.selectedTestimonyNames.includes(name)){
          this.selectedTestimonyNames.push(name);
        }
      } else if (tag == "aboutWog") {
        if(!this.selectedWogNames.includes(name)){
          this.selectedWogNames.push(name);
          this.meetingsForm.get(tag).updateValueAndValidity();
        }       
      } else if (tag == "aboutOthers") {
        if(!this.selectedOthersNames.includes(name)){
          this.selectedOthersNames.push(name);
          this.meetingsForm.get(tag).updateValueAndValidity();
        }        
      } else if (tag == "pics") {
        this.selectedPicsNames.push(name);
      }
    } else if (flag == "remove") {
      if (tag == "moc") {
        this.selectedMocNames.splice(name, 1);
      } else if (tag == "musicians") {
        this.selectedMusiciansNames.splice(name, 1);
      } else if (tag == "arrange") {
        this.selectedArrangeNames.splice(name, 1);
      } else if (tag == "songs") {
        this.selectedSingersNames.splice(name, 1);
        this.meetingsForm.get(tag).updateValueAndValidity();
      } else if (tag == "worshipers") {
        this.selectedWorshipersNames.splice(name, 1);
      } else if (tag == "testimony") {
        this.selectedTestimonyNames.splice(name, 1);
      } else if (tag == "aboutWog") {
        this.selectedWogNames.splice(name, 1);
        this.meetingsForm.get(tag).updateValueAndValidity();
      } else if (tag == "aboutOthers") {
        this.selectedOthersNames.splice(name, 1);
        this.meetingsForm.get(tag).updateValueAndValidity();
      } else if (tag == "pics") {
        if(this.selectedPicsNames[name].file==null) {
          this.deletedPicsUrl.push(this.selectedPicsNames[name].url)
        }
        this.selectedPicsNames.splice(name, 1);
      }
    }
  }

  selectRowValue(meeting: Meeting) {
    this.clearFields();
    this.meetingsForm.controls.date.setValue(formatDate(meeting.date, 'yyyy-MM-dd', 'en'));
    if(this.isArrayNotEmpty(meeting.moc)) {
      meeting.moc.forEach(moc=>this.selectedMocNames.push(moc));
    }
    if(this.isArrayNotEmpty(meeting.arrangements)) {
      meeting.arrangements.forEach(arrangements=>this.selectedArrangeNames.push(arrangements));
    }    
    if(this.isArrayNotEmpty(meeting.worshipers)) {
      meeting.worshipers.forEach(worshipers=>this.selectedWorshipersNames.push(worshipers));
    }
    if(this.isArrayNotEmpty(meeting.musicians)) {
      meeting.musicians.forEach(musicians=>this.selectedMusiciansNames.push(musicians));
    }
    if(this.isArrayNotEmpty(meeting.singers)) {
      meeting.singers.forEach(singers=>this.selectedSingersNames.push(singers));
    }    
    this.meetingsForm.controls.songs.setValue(meeting.songs)
    if(this.isArrayNotEmpty(meeting.testimony)) {
      meeting.testimony.forEach(testimony=>this.selectedTestimonyNames.push(testimony));
    }
    if(this.isArrayNotEmpty(meeting.wog)) {
      meeting.wog.forEach(wog=>this.selectedWogNames.push(wog));
    }
    this.meetingsForm.controls.aboutWog.setValue(meeting.aboutWog)
    if(this.isArrayNotEmpty(meeting.others)) {
      meeting.others.forEach(others=>this.selectedOthersNames.push(others));
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



export class NameModel {
  name: string
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
