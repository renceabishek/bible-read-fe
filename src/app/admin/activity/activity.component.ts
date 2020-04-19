import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { NameModel } from '../youthmeetings/youthmeetings.component';
import { NameBoxComponent } from '../dialog/name-box/name-box.component';
import { formatDate } from '@angular/common';
import { Activity } from 'src/app/model/Activity';
import { ActivityDatatableComponent } from './datatable/datatable.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  activityForm: FormGroup;
  allNames = [];
  selectedOrganizersNames = [];
  selectedParticipationsNames = [];
  selectedHelpersNames = [];
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
           'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
   };

  @ViewChild(ActivityDatatableComponent, { static: true }) child: ActivityDatatableComponent;
  @ViewChild(FormGroupDirective, { static: true }) form: FormGroupDirective

  constructor(public dialog: MatDialog, private adminService: AdminService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activityForm = this.formBuilder.group({
      title:['', Validators.required],
      date:['', Validators.required],
      content:['', Validators.required]
    });

    this.adminService.getProfiles().subscribe(data => {
      data.forEach(f => {
        let value: NameModel = {
          name: f.name
        }
        this.allNames.push(value)
      })
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

     var activity = <Activity>{
      title: this.activityForm.get('title').value,
      date: formatDate(this.activityForm.controls.date.value, 'yyyy-MM-dd', 'en'),
      content: this.activityForm.get('content').value,
      helpedBy: this.selectedHelpersNames,
      organizedBy: this.selectedOrganizersNames,
      participatedBy: this.selectedParticipationsNames
    };

    if (this.saveUP == true) {
      return this.onUpdate(activity);
    }    

    this.adminService.postActivityInfo(activity).subscribe(data=>{
        activity.uniqueId = data;
        this.child.saveRowValues(activity);
        this.onReset();
       //this.form.resetForm();

       
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
    this.submitted=true;
  }

  onDeleteRows(): void {
    console.log("delete now")
    this.crudFlag = "delete";
    if (this.uniqueId.length > 0) {
      this.adminService.deleteActivityInfo(this.uniqueId)
        .subscribe(data => {
          this.child.deleteRowValues(this.uniqueId)
          this.onReset();
        })
    }
  }

  onUpdate(activity): void {
    console.log("update here")

    this.adminService.putActivityInfo(activity, this.uniqueId)
      .subscribe(data => {
        this.child.UpdateRowValues(activity, this.uniqueId)
        this.onReset();
      })
  }


  onSelectName(tag): void {
    console.log('on select')
    const dialogRef = this.dialog.open(NameBoxComponent, {
      width: "300px",
      height: "600px",
      data: { name: this.allNames },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      result.forEach(element => {
        this.addToOrRemoveFromSelectedList('add', tag, element.name);
      });
    });
  }

  clearNames(index, tag): void {
    console.log('on delete ' + index)
    this.addToOrRemoveFromSelectedList('remove', tag, index);
  }

  addToOrRemoveFromSelectedList(flag, tag, name): void {
    if (flag == "add") {
      if (tag == "organizers") {
        this.selectedOrganizersNames.push(name);
      } else if (tag == "helpers") {
        this.selectedHelpersNames.push(name);
      } else if (tag == "participants") {
        this.selectedParticipationsNames.push(name);
      }
    } else if (flag == "remove") {
      if (tag == "organizers") {
        this.selectedOrganizersNames.splice(name, 1);
      } else if (tag == "helpers") {
        this.selectedHelpersNames.splice(name, 1);
      } else if (tag == "participants") {
        this.selectedParticipationsNames.splice(name, 1);
      } 
    }
  }

  selectRowValue(activity: Activity) {
    this.activityForm.controls.title.setValue(activity.title);
    this.activityForm.controls.content.setValue(activity.content);
    this.activityForm.controls.date.setValue(formatDate(activity.date, 'yyyy-MM-dd', 'en'));
    this.selectedHelpersNames = activity.helpedBy;
    this.selectedOrganizersNames = activity.organizedBy;
    this.selectedParticipationsNames = activity.participatedBy;
    this.saveUP = true;
    this.uniqueId = activity.uniqueId;
  }
}