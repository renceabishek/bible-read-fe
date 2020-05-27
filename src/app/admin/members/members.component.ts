import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { Profile } from '../../model/Profile';
import { formatDate } from '@angular/common';
import { AdminService } from '../../service/admin.service';
import { MatDialog, MatSnackBarConfig, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { SkillBoxComponent } from '../dialog/skill-box/skill-box.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProfileGet } from 'src/app/model/ProfilesGet';
import { UpdateProfile } from 'src/app/model/UpdateProfile';
import { SpinnerOverlayServiceService } from 'src/app/spinner-overlay-service.service';

@Component({
  selector: 'app-youthmembers',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class YouthMembersComponent implements OnInit {

  name = '';
  file : any;
  skillSet = [];
  stopSkillSetDialogToBeOpen = false;
  nameData: ProfileGet[];
  stateCtrl = new FormControl();
  filteredNames: Observable<ProfileGet[]>;
  profilesNameandId: string[];
  saveUP = false;
  uniqueId = "";
  avatarBackGround = '../../../assets/admin/profilepic/male.jpg';

  rowData: String[];
  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true }
  ];
  profiles: FormGroup;
  @ViewChild(FormGroupDirective, { static: true }) form: FormGroupDirective

  searchProfiles: FormGroup;
  

  constructor(private formBuilder: FormBuilder, private adminService: AdminService, public dialog: MatDialog,
    private spinnerService: SpinnerOverlayServiceService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.profiles = this.formBuilder.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      sex: ['', Validators.required],
      isBibleReader: ['',],
      role: ['', Validators.required],
      skillSet: ['',],
      about: ['', Validators.required],

    });

    this.searchProfiles = this.formBuilder.group({
      search: '',
    });

    this.adminService.getProfiles().subscribe(data => {
      this.nameData = data;
      this.filteredNames = this.searchProfiles.controls['search'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterName(value))
        );

    })

    this.profiles.controls.sex.setValue("male");
    this.profiles.controls.role.setValue("member");
    this.profiles.get('dob').setValue(formatDate(new Date, 'yyyy-MM-dd', 'en'))
  }

  private _filterName(value: string): ProfileGet[] {
    if (value != null) {
      return this.nameData
        .filter(option => option.name.toLowerCase().includes(value));

    }
  }

  public errorHandling = (control: string, error: string) => {
    return this.profiles.controls[control].hasError(error);
  }

  selectName(fprofile): void {
    console.log('id ' + fprofile.uniqueId)
    this.spinnerService.show();
    this.uniqueId = fprofile.uniqueId
    this.fetchProfile(fprofile.uniqueId);
    this.saveUP = true;
  }


  displayFn(project): string {
    return project ? project.name : project;
  }

  fetchProfile(uniqueId): void {
    this.adminService.getProfile(uniqueId).subscribe(data => {
      this.profiles.controls.name.setValue(data.name);
      this.profiles.controls.dob.setValue(data.dob);
      this.profiles.controls.sex.setValue(data.sex);
      this.profiles.controls.role.setValue(data.role);
      this.profiles.controls.isBibleReader.setValue(data.isBibleReader);
      this.profiles.controls.about.setValue(data.about);
      this.skillSet = data.skills;
      if(data.profileUrl==null || data.profileUrl=="") {
        if (data.sex == 'male') {
          this.avatarBackGround = '../../../assets/admin/profilepic/male.jpg';
        } else {
          this.avatarBackGround = '../../../assets/admin/profilepic/female.png';
        }
      } else {
        this.avatarBackGround=data.profileUrl;
      }
      this.spinnerService.hide();
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
      this.file= file;
      //reader.readAsBinaryString(file);
    }
  }

  public onSubmit(profileForm) {

    if (this.profiles.invalid) {
      console.log("form vali")
      return;
    }
    console.log('name ' + this.profiles.value.name)
    console.log('file ' + this.file)
    this.spinnerService.show();

    if (this.saveUP == true) {
      return this.onUpdate(profileForm);
    }

    var createProfile = <Profile>{
      name: this.profiles.value.name,
      dob: formatDate(this.profiles.value.dob, 'yyyy-MM-dd', 'en'),
      sex: this.profiles.value.sex,
      isBibleReader: this.profiles.value.isBibleReader,
      role: this.profiles.value.role,
      skills: this.skillSet,
      about: this.profiles.value.about,
    };

    this.adminService.saveProfile(createProfile, this.file).subscribe(data => {
      this.uniqueId = data;
      this.removeOrAddSearchButtonResponse("add");
      this.saveUP=true;
      profileForm.resetForm();
      this.onClear();
      this.spinnerService.hide();
      this.successSnackBar("Profile Saved Succesfully !");
    })
    //this.rowData.push()
  }

  onReset(profileForm): void {
    profileForm.resetForm();
    this.onClear();
  }

  onClear(): void {
    this.saveUP = false;
    this.uniqueId = "";
    this.profiles.get('dob').setValue(formatDate(new Date, 'yyyy-MM-dd', 'en'))
    this.profiles.get('isBibleReader').setValue(false);
    this.skillSet = [];
    this.avatarBackGround = '../../../assets/admin/profilepic/male.jpg';
    this.profiles.controls.sex.setValue("male");
    this.profiles.controls.role.setValue("member");
    this.searchProfiles.get('search').setValue("");
  }

  onUpdate(profileForm): void {

    var updateProfile = <UpdateProfile>{
      name: this.profiles.get('name').value,
      dob: formatDate(this.profiles.get('dob').value, 'yyyy-MM-dd', 'en'),
      sex: this.profiles.get('sex').value,
      isBibleReader: this.profiles.get('isBibleReader').value,
      role: this.profiles.get('role').value,
      skills: this.skillSet,
      about: this.profiles.get('about').value,
    };

    console.log("while udpate " + updateProfile.isBibleReader)

    this.adminService.updateProfile(updateProfile, this.file, this.uniqueId).subscribe(data => {
      this.removeOrAddSearchButtonResponse("update");
      profileForm.resetForm();
      this.onClear();
      this.spinnerService.hide();
      this.successSnackBar("Profile Updated Succesfully !");
    });

  }

  onSexChange(sex): void {
    console.log("value " + sex);
    if (this.avatarBackGround.endsWith("male.jpg") || this.avatarBackGround.endsWith("female.png")) {
      if (sex == 'male') {
        this.avatarBackGround = '../../../assets/admin/profilepic/male.jpg';
      } else {
        this.avatarBackGround = '../../../assets/admin/profilepic/female.png';
      }
    }

  }

  handleReaderLoaded(e) {
    this.avatarBackGround = e.target.result;
    console.log("files "+e.target.result)
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

  onDeleteProfile(profileForm): void {
    if (this.uniqueId.length > 0) {
      this.spinnerService.show();
      this.adminService.deleteProfile(this.uniqueId)
        .subscribe(data => {
          this.removeOrAddSearchButtonResponse("remove");
          profileForm.resetForm();
          this.onClear();
          this.spinnerService.hide();
          this.successSnackBar("Profile deleted Succesfully !");
        })
    }
  }

  removeOrAddSearchButtonResponse(flag: string) {
    if (flag == "remove") {
      let index;
      for (let i = 0; i < this.nameData.length; i++) {
        if (this.nameData[i].uniqueId == this.uniqueId) {
          index = i;
        }
      }
      this.nameData.splice(index, 1)
    } else if (flag == "add") {
      let profileGet = <ProfileGet>{
        name: this.profiles.value.name,
        uniqueId: this.uniqueId
      }
      this.nameData.push(profileGet)
    } else if(flag=="update") {
      let index;
      for (let i = 0; i < this.nameData.length; i++) {
        if (this.nameData[i].uniqueId == this.uniqueId) {
          index = i;
        }
      }
      let profileGet = <ProfileGet>{
        name: this.profiles.value.name,
        uniqueId: this.uniqueId
      }
      this.nameData.splice(index, 1)
      this.nameData.push(profileGet)
    }
    this.filteredNames = this.searchProfiles.controls['search'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterName(value))
      );
  }

  //@ViewChild(NgForm,{static: true}) yourForm: NgForm;


  onClearSearch(profileForm): void {
    this.onReset(profileForm);
  }

  actionButtonLabel: string = 'Ok';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  successSnackBar(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    config.panelClass = ['success-snapbar']
    this.snackBar.open(message, this.action ? this.actionButtonLabel : undefined, config);
  }


}
