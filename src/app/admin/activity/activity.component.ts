import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { NameBoxComponent } from '../dialog/name-box/name-box.component';
import { formatDate } from '@angular/common';
import { Activity } from 'src/app/model/Activity';
import { ActivityDatatableComponent } from './datatable/datatable.component';
import { SpinnerOverlayServiceService } from 'src/app/spinner-overlay-service.service';
import { NameModel } from '../model/NameModel';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  activityForm: FormGroup;
  allNames: NameModel[] = [];
  selectedOrganizersNames: NameModel[] = [];
  selectedParticipationsNames: NameModel[] = [];
  selectedHelpersNames: NameModel[] = [];
  selectedPicsNames: picsModel[] = [];
  deletedPicsUrl=[];
  saveUP = false;
  uniqueId="";
  crudFlag="";
  submitted=false;
  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
           '|', 'ClearFormat', 'Print', 'SourceCode']
   };
   // , '|', 'FullScreen'            'Image',

   actionButtonLabel: string = 'Ok';
   action: boolean = true;
   setAutoHide: boolean = true;
   autoHide: number = 3000;
   horizontalPosition: MatSnackBarHorizontalPosition = 'end';
   verticalPosition: MatSnackBarVerticalPosition = 'top';

   
  @ViewChild(ActivityDatatableComponent, { static: true }) child: ActivityDatatableComponent;
  @ViewChild(FormGroupDirective, { static: true }) form: FormGroupDirective

  constructor(public dialog: MatDialog, private adminService: AdminService, private formBuilder: FormBuilder,
    private spinnerService: SpinnerOverlayServiceService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.activityForm = this.formBuilder.group({
      title:['', Validators.required],
      date:['', Validators.required],
      content:['', Validators.required]
    });

    this.adminService.getProfiles().subscribe(data => {
      
      let value: NameModel = {
        name: "All",
        uniqueId: "1000"
      }
      this.allNames.push(value)

      data.forEach(f => {
        let value: NameModel = {
          name: f.name,
          uniqueId: f.uniqueId
        }
        this.allNames.push(value)
      })
     // this.child.sendNameAndUniqueId(this.allNames)
    });

    this.activityForm.get('date').setValue(formatDate(new Date, 'yyyy-MM-dd', 'en'));
  }

  get f() { return this.activityForm.controls; }

  public errorHandling = (control: string, error: string) => {
    return this.activityForm.controls[control].hasError(error);
  }

  additionalFormValidation() {
    if(this.selectedOrganizersNames.length<=0 || this.selectedParticipationsNames.length<=0) {
      return true;
    }
    return false;
  }

  onOpenClick(index) {
    window.open(this.selectedPicsNames[index].url)
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
      this.addToOrRemoveFromSelectedList('add', 'pics', picsModel);
    }
  }

  onSave(): void {

    if (this.activityForm.invalid) {
      console.log("form vali")
      // this.anim.stop();
      return;
    }

    if(this.crudFlag == "delete") {
      this.crudFlag="";
      return
    }

     console.log('checking contnt '+this.activityForm.get('content').value)
     this.spinnerService.show();
     var activity = <Activity>{
      title: this.activityForm.get('title').value,
      date: formatDate(this.activityForm.controls.date.value, 'yyyy-MM-dd', 'en'),
      content: this.activityForm.get('content').value,
      helpedBy: this.selectedHelpersNames.map(f=>f.uniqueId),
      helpedByModel: this.selectedHelpersNames,
      organizedBy: this.selectedOrganizersNames.map(f=>f.uniqueId),
      organizedByModel: this.selectedOrganizersNames,
      participatedBy: this.selectedParticipationsNames.map(f=>f.uniqueId),
      participatedByModel: this.selectedParticipationsNames
    };
    activity.picsUrl = [];
    if (this.saveUP == true) {
      return this.onUpdate(activity);
    }    

    let files=[]
    this.selectedPicsNames.forEach(f=>{
      files.push(f.file);
    })

    this.adminService.postActivityInfo(activity, files).subscribe(data=>{
        let jsonData= JSON.parse(data);
        activity.uniqueId = jsonData.uniqueId;
        let listsOfUrl = jsonData.picsUrl
        listsOfUrl.forEach(url=>{
         activity.picsUrl.push(url)
        })
        this.child.saveRowValues(activity);
        this.onReset();
        this.spinnerService.hide();
        this.successSnackBar("Details Saved Succesfully !");       
    })
    console.log("save values ")

  }

  onReset(): void {
    this.saveUP = false;
    this.uniqueId = "";
    this.form.resetForm();
    this.activityForm.get('date').setValue(formatDate(new Date, 'yyyy-MM-dd', 'en'));
    this.selectedOrganizersNames=[];
    this.selectedParticipationsNames=[];
    this.selectedHelpersNames=[];
    this.selectedPicsNames=[];
    this.submitted=true;
    this.deletedPicsUrl=[];
  }

  onDeleteRows(): void {
    console.log("delete now")
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

      this.adminService.deleteActivityInfo(this.uniqueId, picstoBedelete)
        .subscribe(data => {
          this.child.deleteRowValues(this.uniqueId)
          this.onReset();
          this.spinnerService.hide();
          this.successSnackBar("Details deleted Succesfully !");
        })
    }
  }

  onUpdate(activity): void {
    console.log("update here")

    let files =[]
    for(let i=0;i<this.selectedPicsNames.length;i++) {
      if(this.selectedPicsNames[i].file!= null) {
        files.push(this.selectedPicsNames[i].file);
      } else {
        activity.picsUrl.push(this.selectedPicsNames[i].url)
      }
    }


    this.adminService.putActivityInfo(activity, files, this.uniqueId, this.deletedPicsUrl)
      .subscribe(data => {
        if(data!=null && data!=undefined && data!="") {
          let ListsOfUrl =JSON.parse(data)
          ListsOfUrl.forEach(url=> {
            activity.picsUrl.push(url);
          })
        }
        this.child.UpdateRowValues(activity, this.uniqueId)
        this.onReset();
        this.spinnerService.hide();
        this.successSnackBar("Details Updated Succesfully !")
      })
  }


  onSelectName(tag): void {
    console.log('on select')

    const dialogRef = this.dialog.open(NameBoxComponent, {
      width: "300px",
      height: "500px",
      data: { name: this.allNames },
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

  isArrayAvailable(value: any): boolean {
    if(value!=null && value.length>0) {
      return true;
    } else {
      return false;
    }
  }

  clearNames(index, tag): void {
    console.log('on delete ' + index)
    this.addToOrRemoveFromSelectedList('remove', tag, index);
  }

  addToOrRemoveFromSelectedList(flag, tag, element): void {
    if (flag == "add") {
      let nameElement: NameModel= {
        name: element.name,
        uniqueId: element.uniqueId
      }
      if (tag == "organizers") {
        if(!this.selectedOrganizersNames.map(f=>f.uniqueId).includes(element.uniqueId)) {
          this.selectedOrganizersNames.push(element);
        }
      } else if (tag == "helpers") {
        if(!this.selectedHelpersNames.map(f=>f.uniqueId).includes(element.uniqueId)) {
          this.selectedHelpersNames.push(element);
        }        
      } else if (tag == "participants") {
        if(!this.selectedParticipationsNames.map(f=>f.uniqueId).includes(element.uniqueId)) {
          this.selectedParticipationsNames.push(nameElement);
        }        
      } else if (tag == "pics") {
        this.selectedPicsNames.push(element);
      }
    } else if (flag == "remove") {
      if (tag == "organizers") {
        this.selectedOrganizersNames.splice(element, 1);
      } else if (tag == "helpers") {
        this.selectedHelpersNames.splice(element, 1);
      } else if (tag == "participants") {
        this.selectedParticipationsNames.splice(element, 1);
      } else if (tag == "pics") {
        if(this.selectedPicsNames[element].file==null) {
          this.deletedPicsUrl.push(this.selectedPicsNames[element].url)
        }
        this.selectedPicsNames.splice(element, 1);
      }
    }
  }

  selectRowValue(activity: Activity) {
    this.selectedOrganizersNames=[]
    this.selectedHelpersNames = []
    this.selectedParticipationsNames = []

    this.activityForm.controls.title.setValue(activity.title);
    this.activityForm.controls.content.setValue(activity.content);
    this.activityForm.controls.date.setValue(formatDate(activity.date, 'yyyy-MM-dd', 'en'));
    if(this.isArrayNotEmpty(activity.helpedByModel)) {
      activity.helpedByModel.forEach(help=>this.selectedHelpersNames.push(help))
    }
    // this.isNameModelAvailable(activity.organizedByModel,activity.organizedBy, this.selectedOrganizersNames,activity.uniqueId);
    // this.isNameModelAvailable(activity.participatedByModel,activity.participatedBy, this.selectedParticipationsNames,activity.uniqueId);

    if(this.isArrayNotEmpty(activity.organizedByModel)) {
      activity.organizedByModel.forEach(f=>this.selectedOrganizersNames.push(f))
    }
    if(this.isArrayNotEmpty(activity.participatedByModel)) {
      activity.participatedByModel.forEach(f=>this.selectedParticipationsNames.push(f))
    }
    

    if(activity.picsUrl!=null) {
      for(let i=0;i<activity.picsUrl.length;i++) {
        const name = activity.picsUrl[i].split('%2F')[2].split('?')[0].replace('%20',' ')
        let picsModel = <picsModel> {
          name: name,
          url: activity.picsUrl[i]
        }
        this.selectedPicsNames.push(picsModel)
      }
     }
     else {
      this.selectedPicsNames=[];
    }

    this.saveUP = true;
    this.uniqueId = activity.uniqueId;
  }

  isArrayNotEmpty(value: any):boolean {
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
