import { Component, OnInit } from '@angular/core';
import { NameBoxComponent } from '../dialog/name-box/name-box.component';
import { MatDialog } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-youthmeetings',
  templateUrl: './youthmeetings.component.html',
  styleUrls: ['./youthmeetings.component.css']
})
export class YouthmeetingsComponent implements OnInit {

  stopSkillSetDialogToBeOpen = false;
  saveUP=false;
  mocNames = [];
  selectedMocNames = [];
  selectedMusiciansNames = [];
  selectedArrangeNames = [];
  selectedSingersNames = [];
  selectedWorshipersNames = [];
  selectedTestimonyNames = [];
  selectedWogNames = [];
  selectedOthersNames=[];
  meetingsForm: FormGroup;

  constructor(public dialog: MatDialog, private adminService: AdminService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.meetingsForm = this.formBuilder.group({
      date: ['', Validators.required],
      mocNames: ['',],
      songs: ['',],
      aboutWog: ['',],
      remarks: ['', Validators.required],
      aboutOthers: []

    });

    this.adminService.getProfiles().subscribe(data => {
      data.forEach(f => {
        let value: NameModel = {
          name: f.name
        }
        this.mocNames.push(value)
      })
    });
  }

  onSave(): void {

  }

  onReset(): void {

  }

  onDeleteRows(): void {

  }

  public errorHandling = (control: string, error: string) => {
    return this.meetingsForm.controls[control].hasError(error);
  }

  onSelectName(tag): void {
    console.log('on select')
    if (this.stopSkillSetDialogToBeOpen == true) {
      this.stopSkillSetDialogToBeOpen = false;
      return
    }
    this.stopSkillSetDialogToBeOpen = false;
    const dialogRef = this.dialog.open(NameBoxComponent, {
      width: "800px",
      height: "300px",
      data: { name: this.mocNames },
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
    this.stopSkillSetDialogToBeOpen = true;
  }

  addToOrRemoveFromSelectedList(flag, tag, name): void {
    if (flag == "add") {
      if (tag == "moc") {
        this.selectedMocNames.push(name);
      } else if (tag == "musicians") {
        this.selectedMusiciansNames.push(name);
      } else if (tag == "arrange") {
        this.selectedArrangeNames.push(name);
      } else if (tag == "singers") {
        this.selectedSingersNames.push(name);
      } else if (tag == "worshipers") {
        this.selectedWorshipersNames.push(name);
      } else if (tag == "testimony") {
        this.selectedTestimonyNames.push(name);
      } else if (tag == "wog") {
        this.selectedWogNames.push(name);
      } else if (tag == "others") {
        this.selectedOthersNames.push(name);
      }
    } else if (flag == "remove") {
      if (tag == "moc") {
        this.selectedMocNames.splice(name, 1);
      } else if (tag == "musicians") {
        this.selectedMusiciansNames.splice(name, 1);
      } else if (tag == "arrange") {
        this.selectedArrangeNames.splice(name, 1);
      } else if (tag == "singers") {
        this.selectedSingersNames.splice(name, 1);
      } else if (tag == "worshipers") {
        this.selectedWorshipersNames.splice(name, 1);
      } else if (tag == "testimony") {
        this.selectedTestimonyNames.splice(name, 1);
      } else if (tag == "wog") {
        this.selectedWogNames.splice(name, 1);
      } else if (tag == "others") {
        this.selectedOthersNames.splice(name, 1);
      }
    }
  }
}

export class NameModel {
  name: string
}
