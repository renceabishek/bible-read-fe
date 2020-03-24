import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ChartServiceService } from '../../chart-service.service';
import { DailyData } from '../../model/DailyData';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, catchError, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CommonService } from '../../service/commonService';
import { AutoCompleteDialogComponent } from '../auto-complete-dialog/auto-complete-dialog.component';
import { DatatableComponent } from './datatable/datatable.component';

@Component({
  selector: 'app-bible-info',
  templateUrl: './bible-info.component.html',
  styleUrls: ['./bible-info.component.css']
})
export class BibleInfoComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  saveUP = false;
  crudFlag: String;

  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  loading = false;


  myControl = new FormControl();
  listOfBooks: string[] = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes',
    'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'];
  filteredBooks: Observable<string[]>;

  nameData: string[];
  filteredNames: Observable<string[]>;
  uniqueId: any;

  name = '';
  date = '';
  books = '';
  chapter = '';
  fromVerse = '';
  toVerse = '';


  @ViewChild(DatatableComponent, { static: true }) child: DatatableComponent;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService, public snackBar: MatSnackBar, private commonService: CommonService,
    public dialog: MatDialog) {
    this.lottieConfig = {
      path: 'assets/loading.json',
      renderer: 'canvas',
      autoplay: false,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  ngOnInit() {
    //this.commonService.modifyMenuActive('bibleinfo'); , Validators.pattern("^[0-9]*$"), Validators.minLength(3)

    this.registerForm = this.formBuilder.group({
      date: ['', Validators.required],
      name: ['', Validators.required],
      books: ['', Validators.required],
      chapter: ['', Validators.required],
      fromVerse: ['', Validators.required],
      toVerse: ['', Validators.required]
    }, {
      validators: [
        VerseCheck('fromVerse', 'toVerse')
      ]
    });

    this.registerForm.controls.date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));


    this.adminService.getProfiles().subscribe(data => {
      // this.nameData = data.map(f => f.split("~")[0]);
      // this.filteredNames = this.registerForm.controls['name'].valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => this._filterName(value))
      //   );
    });




    this.filteredBooks = this.registerForm.controls['books'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


  }

  private _filter(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.listOfBooks.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  private _filterName(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.nameData.filter(option => option.toLowerCase().includes(filterValue));
    }

  }

  addBibleDetails() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  onSave() {
    //this.anim.play();
    if (this.crudFlag == "delete" || this.crudFlag == "clear") {
      console.log("delete or clear")
      this.submitted = false;
      this.crudFlag = "";
      // this.anim.stop();
      return;
    }

    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log("form vali")
      // this.anim.stop();
      return;
    }

    if (this.saveUP == true) {
      return this.onUpdate();
    }

    var createDailyData = <DailyData>{
      name: this.registerForm.get('name').value,
      date: formatDate(this.registerForm.controls.date.value, 'yyyy-MM-dd', 'en'),
      portion: this.registerForm.get('books').value,
      chapter: this.registerForm.controls.chapter.value,
      fromVerses: this.registerForm.controls.fromVerse.value,
      toVerses: this.registerForm.controls.toVerse.value,
      uniqueId: ""
    };

    this.adminService.postBibleInfo(createDailyData)
      .subscribe(data => {
        createDailyData.uniqueId = data;
        this.child.saveRowValues(createDailyData);
        // this.anim.stop();
        console.log("successfully saved");
        this.onReset();
        this.successSnackBar();
      });

  }

  onUpdate(): void {
    var createDailyData = <DailyData>{
      name: this.registerForm.get('name').value,
      date: formatDate(this.registerForm.controls.date.value, 'yyyy-MM-dd', 'en'),
      portion: this.registerForm.get('books').value,
      chapter: this.registerForm.controls.chapter.value,
      fromVerses: this.registerForm.controls.fromVerse.value,
      toVerses: this.registerForm.controls.toVerse.value,
    };

    this.adminService.putBibleInfo(createDailyData, this.uniqueId)
      .subscribe(data => {
        this.child.UpdateRowValues(createDailyData, this.uniqueId)
        // this.anim.stop();
        this.onReset();
        this.successSnackBar();
      })
  }

  onReset() {
    this.submitted = false;
    this.uniqueId = "";
    this.crudFlag = "clear";
    this.registerForm.controls.chapter.setValue('');
    this.registerForm.controls.fromVerse.setValue('');
    this.registerForm.controls.toVerse.setValue('');
    this.registerForm.controls.date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.registerForm.get('books').setValue('');
    this.registerForm.get('name').setValue('');
    this.saveUP = false

  }


  rowTobeDeleted: string

  disable: any;
  onDeleteRows(): void {
    //this.registerForm.disable()
    this.crudFlag = "delete";
    console.log('deleted ' + this.uniqueId)
    if (this.uniqueId.length > 0) {
      this.adminService.deleteBibleInfo(this.uniqueId)
        .subscribe(data => {
          this.child.deleteRowValues(this.uniqueId)
          this.onReset();
          this.successSnackBar();
        })
    }
  }

  selectedAutoCompleteName(value): void {
    console.log('selected value ' + value)
    this.registerForm.controls.name = value;
  }


  message: string = 'Bible Information Uploaded.';
  actionButtonLabel: string = 'Success';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  addExtraClass: boolean = false;

  successSnackBar() {

    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    //config.extraClasses = this.addExtraClass ? ['test'] : undefined;
    this.snackBar.open(this.message, this.action ? this.actionButtonLabel : undefined, config);
  }

  openNameDialog(): void {
    const dialogRef = this.dialog.open(AutoCompleteDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: { name: this.name, animal: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  public numberValidator(event) {
    const allowedRegex = /[0-9]/g;

    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }

  selectRowValue(dailyData: DailyData) {
    this.registerForm.controls.chapter.setValue(dailyData.chapter);
    this.registerForm.controls.fromVerse.setValue(dailyData.fromVerses);
    this.registerForm.controls.toVerse.setValue(dailyData.toVerses);
    this.registerForm.controls.date.setValue(formatDate(dailyData.date, 'yyyy-MM-dd', 'en'));
    this.registerForm.get('books').setValue(dailyData.portion);
    this.registerForm.get('name').setValue(dailyData.name);
    this.saveUP = true;
    this.uniqueId = dailyData.uniqueId;
  }


}

export function VerseCheck(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (parseFloat(control.value) > parseFloat(matchingControl.value)) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }

}
