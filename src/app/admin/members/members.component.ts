import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Profile } from '../../model/Profile';
import { formatDate } from '@angular/common';
import { AdminService } from '../../service/admin.service';
import { MatDialog } from '@angular/material';
import { SkillBoxComponent } from '../dialog/skill-box/skill-box.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProfileGet } from 'src/app/model/ProfilesGet';

@Component({
  selector: 'app-youthmembers',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class YouthMembersComponent implements OnInit {

  name = '';
  file = '';
  skillSet = [];
  stopSkillSetDialogToBeOpen = false;
  nameData: ProfileGet[];
  stateCtrl = new FormControl();
  filteredNames: Observable<ProfileGet[]>;
  profilesNameandId: string[];
  crudFlag: string;
  saveUP = false;
  uniqueId = "";
  avatarBackGround = '../../../assets/admin/profilepic/male.jpg';

  rowData: String[];
  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true }
  ];
  profiles: FormGroup;
  searchProfiles: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private adminService: AdminService, public dialog: MatDialog) { }

  ngOnInit() {
    this.profiles = this.formBuilder.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      sex: ['', Validators.required],
      isBibleReader: ['', ],
      role: ['', Validators.required],
      skillSet: ['', ],
      about: ['', Validators.required],

    });

    this.searchProfiles = this.formBuilder.group({
      search: '',
    });

    this.adminService.getProfiles().subscribe(data => {
      this.nameData=data;
      this.filteredNames = this.searchProfiles.controls['search'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterName(value))
        );

    })

    this.profiles.controls.sex.setValue("male");
    this.profiles.controls.role.setValue("member");
  }

  private _filterName(value: string): ProfileGet[] {
    if(value!=null) {
      return this.nameData
        .filter(option => option.name.toLowerCase().indexOf(value) === 0);
      
    }
  }

  selectName(fprofile): void {
    console.log('id '+fprofile.uniqueId)
    this.fetchProfile(fprofile.uniqueId);
    this.saveUP = true;
  }


  displayFn(project): string {
      return project ? project.name : project;
  }

  fetchProfile(uniqueId): void {
    this.adminService.getProfile(uniqueId).subscribe(data=>{
      this.profiles.controls.name.setValue(data.name);
      this.profiles.controls.dob.setValue(data.dob);
      this.profiles.controls.sex.setValue(data.sex);
      this.profiles.controls.role.setValue(data.role);
      this.profiles.controls.isBibleReader.setValue(data.isBibleReader);
      this.profiles.controls.about.setValue(data.about);
      this.skillSet = data.skills;
      this.uniqueId = data.uniqueId;
      console.log("uniques "+this.uniqueId)
    });
  }

  get f() { return this.profiles.controls; }

  base64textString = [];

  changeListener(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();
      console.log('file is available ' + file)
      reader.readAsDataURL(file);
      reader.onload = this.handleReaderLoaded.bind(this);
      //reader.readAsBinaryString(file);
    }
  }

  public onSubmit() {
    if(this.crudFlag=="clear" || this.crudFlag=="delete") {
      console.log("clear and delete")
      this.submitted = false;
      this.crudFlag="";
      return
    }
    this.submitted = true;
    if (this.profiles.invalid) {
      console.log("form vali")
      return;
    }
    console.log('name ' + this.profiles.value.name)
    console.log('file ' + this.base64textString)

    if(this.saveUP == true) {
      return this.onUpdate();
    }

    var createProfile = <Profile>{
      name: this.profiles.get('name').value,
      dob: formatDate(this.profiles.get('dob').value, 'yyyy-MM-dd', 'en'),
      sex: this.profiles.get('sex').value,
      isBibleReader: this.profiles.get('isBibleReader').value,
      role: this.profiles.get('role').value,
      skills: this.skillSet,
      about: this.profiles.get('about').value,
      file: this.file
    };

    this.adminService.saveProfile(createProfile).subscribe(data=>{
      this.uniqueId = data;
    })
    //this.rowData.push()
  }

  onClear():void {    
      this.submitted = false;
      this.crudFlag = "clear";
      this.saveUP = false;
      this.uniqueId = "";
      this.profiles.get('name').setValue("");
      this.profiles.get('dob').setValue(formatDate(new Date,'yyyy-MM-dd', 'en')),
      this.profiles.get('isBibleReader').setValue(false);
      this.profiles.get('role').setValue("");
      this.skillSet=[];
      this.profiles.get('about').setValue("");
      this.avatarBackGround = '../../../assets/admin/profilepic/male.jpg';
      this.profiles.controls.sex.setValue("male");
      this.profiles.controls.role.setValue("member");      
  }

  onUpdate(): void {

    var updateProfile = <Profile>{
      name: this.profiles.get('name').value,
      dob: formatDate(this.profiles.get('dob').value, 'yyyy-MM-dd', 'en'),
      sex: this.profiles.get('sex').value,
      isBibleReader: this.profiles.get('isBibleReader').value,
      role: this.profiles.get('role').value,
      skills: this.skillSet,
      about: this.profiles.get('about').value,
      file: this.file
    };

    this.adminService.updateProfile(updateProfile, this.uniqueId);

  }

  onSexChange(sex): void {
    console.log("value "+sex);
    if(this.avatarBackGround.endsWith("male.jpg") || this.avatarBackGround.endsWith("female.png")) {
      if(sex=='male') {
        this.avatarBackGround = '../../../assets/admin/profilepic/male.jpg';
      } else {
        this.avatarBackGround = '../../../assets/admin/profilepic/female.png';
      }
    }
    
  }

  handleReaderLoaded(e) {
    this.avatarBackGround = e.target.result;
    //this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
  }

  onSelectSkills(): void {
    console.log('on select')
    if (this.stopSkillSetDialogToBeOpen == true) {
      this.stopSkillSetDialogToBeOpen = false;
      return
    }
    this.stopSkillSetDialogToBeOpen = false;
    const dialogRef = this.dialog.open(SkillBoxComponent, {
      data: { name: this.name, animal: "" },
      panelClass: 'custom-modalbox'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  clearSkills(index): void {
    console.log('on delete')
    this.skillSet.splice(index, 1);
    this.stopSkillSetDialogToBeOpen = true;
  }

  onDeleteProfile(): void {

  }


}
