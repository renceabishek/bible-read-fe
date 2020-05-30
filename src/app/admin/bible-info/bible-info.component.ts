import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ChartServiceService } from '../../chart-service.service';
import { DailyData } from '../../model/DailyData';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, catchError, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CommonService } from '../../service/commonService';
import { AutoCompleteDialogComponent } from '../auto-complete-dialog/auto-complete-dialog.component';
import { DatatableComponent } from './datatable/datatable.component';
import { NameModel } from '../model/NameModel';
import { BibleDataService } from 'src/app/service/bible-data.service';
import { SpinnerOverlayServiceService } from 'src/app/spinner-overlay-service.service';

@Component({
  selector: 'app-bible-info',
  templateUrl: './bible-info.component.html',
  styleUrls: ['./bible-info.component.css']
})
export class BibleInfoComponent implements OnInit {

  bibleForm: FormGroup;
  submitted = false;
  saveUP = false;
  crudFlag: String;

  private anim: any;
  private animationSpeed: number = 1;
  loading = false;


  myControl = new FormControl();
  listOfBooks: string[] = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes',
    'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew','Mark','Luke','John','Acts of the Apostles','Romans','1 Corinthians','2 Corinthians',
    'Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians',
    '1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter',
    '1 John','2 John','3 John','Jude','Revelation'];
  filteredBooks: Observable<string[]>;

  nameData: NameModel[] = [];
  filteredNames: Observable<NameModel[]>;
  uniqueId: any;
  nameUniqueId: string;

  name = '';
  date = '';
  books = '';
  chapter = '';
  fromVerse = '';
  toVerse = '';


  @ViewChild(DatatableComponent, { static: true }) child: DatatableComponent;
  @ViewChild(FormGroupDirective, { static: true }) form: FormGroupDirective;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService, public snackBar: MatSnackBar, private commonService: CommonService,
    public dialog: MatDialog, private bibleDataService: BibleDataService, 
      private spinnerService: SpinnerOverlayServiceService) {
  }


  ngOnInit() {
    //this.commonService.modifyMenuActive('bibleinfo'); , Validators.pattern("^[0-9]*$"), Validators.minLength(3)

    this.bibleForm = this.formBuilder.group({
      date: ['', Validators.required],
      name: ['', Validators.required],
      books: ['', Validators.required],
      chapter: ['', [Validators.required, this.checkChapterWithBible()]],
      fromVerse: ['', [Validators.required, this.checkVersesWithBible()]],
      toVerse: ['', [Validators.required, this.checkVersesWithBible()]]
    }, {
      validators: [
        VerseCheck('fromVerse', 'toVerse')
      ]
    });

    this.bibleForm.controls.date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));


    this.adminService.getProfiles().subscribe(data => {
      this.nameData = data;
      this.filteredNames = this.bibleForm.controls['name'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
    });

    this.filteredBooks = this.bibleForm.controls['books'].valueChanges
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

  private _filterName(value: string): NameModel[] {
    if (value != null) {
      return this.nameData
        .filter(option => option.name.toLowerCase().includes(value));

    }
  }

  checkChapterWithBible(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = this.totalChapters < control.value;
      return forbidden ? { 'chapterBelong': { value: control.value } } : null;
    };
  }

  checkVersesWithBible(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = this.totalToVerse < control.value;
      return forbidden ? { 'verseBelong': { value: control.value } } : null;
    };
  }

  displayFn(project): string {
    console.log("what is project "+project)
    if(project==null || project.name==null){
      return project;
    }
    if(project.name!=null) {
      return project.name
    }

  }

  selectedNameToCheck: any;

  selectName(fname): void {
    console.log("selection "+fname.name);
    this.selectedNameToCheck = fname;
    this.nameUniqueId = fname.uniqueId;
  }

  checkSelectedName() {
    console.log("change ");
    // if (!this.selectedNameToCheck || this.selectedNameToCheck !== this.bibleForm.controls['name'].value) {
    //   //this.bibleForm.controls['name'].setValue(null);
    //   this.bibleForm.get('name').setValue('');
    //   this.selectedNameToCheck = '';
    // }
  }

  selectedBookToCheck: any;
  totalChapters: number
  totalToVerse: number

  selectBook(fname): void {    
    this.selectedBookToCheck = fname;
    this.totalChapters = this.bibleDataService.getBibleTotalChapter(fname);
  }

  toSetToVerse(): void {
    this.totalToVerse = this.bibleDataService
      .getBibleToVerse(this.bibleForm.get('books').value, this.bibleForm.controls.chapter.value)
      console.log("checking.. "+this.totalToVerse)
  }

  checkSelectedBook() {
    if (!this.selectedBookToCheck || this.selectedBookToCheck !== this.bibleForm.controls['books'].value) {
      this.bibleForm.controls['books'].setValue(null);
      this.bibleForm.get('books').setValue('');
      this.selectedBookToCheck = '';
    }
  }

  public errorHandling = (control: string, error: string) => {
    if (control == "toVerseGreater") {
      if (this.bibleForm.controls.toVerse.errors != null &&
        this.bibleForm.controls.toVerse.errors.mustMatch) {
        return true;
      } else {
        return false;
      }
    }
    if (control == "chapterBelong") {
      if (this.bibleForm.controls.chapter.errors != null &&
        this.bibleForm.controls.chapter.errors.chapterBelong) {
        return true;
      } else {
        return false;
      }
    }
    if (control == "verseBelong") {
      if ((this.bibleForm.controls.fromVerse.errors != null &&
        this.bibleForm.controls.fromVerse.errors.verseBelong)
        ||
        (this.bibleForm.controls.toVerse.errors != null &&
          this.bibleForm.controls.toVerse.errors.verseBelong)) {
        return true;
      } else {
        return false;
      }
    }
    return this.bibleForm.controls[control].hasError(error);
  }


  addBibleDetails() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.bibleForm.controls; }


  onSave() {
    if (this.crudFlag == "delete") {
      console.log("delete or clear")
      this.submitted = false;
      this.crudFlag = "";
      return;
    }

    this.submitted = true;
    if (this.bibleForm.invalid) {
      console.log("form vali")
      return;
    }
    this.spinnerService.show();
    if (this.saveUP == true) {
      return this.onUpdate();
    }

    var createDailyData = <DailyData>{
      name: this.nameUniqueId,
      pureName: this.bibleForm.get('name').value.name,
      date: formatDate(this.bibleForm.controls.date.value, 'yyyy-MM-dd', 'en'),
      portion: this.bibleForm.get('books').value,
      chapter: this.bibleForm.controls.chapter.value,
      fromVerses: this.bibleForm.controls.fromVerse.value,
      toVerses: this.bibleForm.controls.toVerse.value,
      uniqueId: ""
    };

    this.adminService.postBibleInfo(createDailyData)
      .subscribe(data => {
        createDailyData.uniqueId = data;
        this.child.saveRowValues(createDailyData);
        this.onReset();
        this.spinnerService.hide();
        this.successSnackBar("Details Saved Successfully!");
      });

  }

  onUpdate(): void {
    var createDailyData = <DailyData>{
      name: this.nameUniqueId,
      date: formatDate(this.bibleForm.controls.date.value, 'yyyy-MM-dd', 'en'),
      portion: this.bibleForm.get('books').value,
      chapter: this.bibleForm.controls.chapter.value,
      fromVerses: this.bibleForm.controls.fromVerse.value,
      toVerses: this.bibleForm.controls.toVerse.value,
      pureName: this.bibleForm.get('name').value.name
    };

    this.adminService.putBibleInfo(createDailyData, this.uniqueId)
      .subscribe(data => {
        this.child.UpdateRowValues(createDailyData, this.uniqueId);        
        this.onReset();
        this.spinnerService.hide();
        this.successSnackBar("Details Uploaded Successfully!");
      })
  }

  onReset() {
    this.submitted = false;
    this.uniqueId = "";
    this.crudFlag = "clear";
    // this.bibleForm.controls.chapter.setValue('');
    // this.bibleForm.controls.fromVerse.setValue('');
    // this.bibleForm.controls.toVerse.setValue('');
    // this.bibleForm.get('books').setValue('');
    // this.bibleForm.get('name').setValue('');
    this.form.resetForm();
    this.bibleForm.get('name').setValue('');
    this.bibleForm.get('books').setValue('');
    this.bibleForm.controls.date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.saveUP = false

  }


  rowTobeDeleted: string

  disable: any;
  onDeleteRows(): void {
    this.crudFlag = "delete";
    if (this.uniqueId.length > 0) {
      this.spinnerService.show();
      this.adminService.deleteBibleInfo(this.uniqueId)
        .subscribe(data => {
          this.child.deleteRowValues(this.uniqueId)
          this.onReset();
          this.spinnerService.hide();
          this.successSnackBar("Details deleted Successfully!");
        })
    }
  }

  selectedAutoCompleteName(value): void {
    console.log('selected value ' + value)
    this.bibleForm.controls.name = value;
  }


  actionButtonLabel: string = 'Ok';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  addExtraClass: boolean = false;

  successSnackBar(message: string) {

    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    config.panelClass = ['success-snapbar']
    this.snackBar.open(message, this.action ? this.actionButtonLabel : undefined, config);
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
    this.bibleForm.controls.chapter.setValue(dailyData.chapter);
    this.bibleForm.controls.fromVerse.setValue(dailyData.fromVerses);
    this.bibleForm.controls.toVerse.setValue(dailyData.toVerses);
    this.bibleForm.controls.date.setValue(formatDate(dailyData.date, 'yyyy-MM-dd', 'en'));
    this.bibleForm.get('books').setValue(dailyData.portion);
    console.log("purname -- "+dailyData.pureName)
    console.log("name--- "+dailyData.name)
    let nameModel: NameModel = {
      name: dailyData.pureName,
      uniqueId: dailyData.name
    }
    this.bibleForm.get('name').setValue(nameModel);
    this.nameUniqueId = dailyData.name;
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
