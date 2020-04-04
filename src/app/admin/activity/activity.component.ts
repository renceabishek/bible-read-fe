import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { NameModel } from '../youthmeetings/youthmeetings.component';
import { NameBoxComponent } from '../dialog/name-box/name-box.component';

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

  constructor(public dialog: MatDialog, private adminService: AdminService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activityForm = this.formBuilder.group({
      title:['', Validators.required],
      date:['', Validators.required],
      selectedOrganizersNames:['', Validators.required],
      selectedParticipationsNames:['', Validators.required],
      selectedHelpersNames:[''],
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
  }

  public errorHandling = (control: string, error: string) => {
    return this.activityForm.controls[control].hasError(error);
  }

  onSave(): void {

  }

  onReset(): void {

  }

  onDeleteRows(): void {

  }


  onSelectName(tag): void {
    console.log('on select')
    const dialogRef = this.dialog.open(NameBoxComponent, {
      width: "800px",
      height: "300px",
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
}
