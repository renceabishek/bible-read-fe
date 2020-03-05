import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-bible-info',
  templateUrl: './bible-info.component.html',
  styleUrls: ['./bible-info.component.css']
})
export class BibleInfoComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;


  myControl = new FormControl();
  listOfBooks: string[] = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes',
    'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'];
    filteredBooks: Observable<string[]>;

  nameData: string[];
  filteredNames: Observable<string[]>;

  name = '';
  date = '';
  books = '';
  chapter = '';
  fromVerse = '';
  toVerse = '';




  constructor(private chartServiceService: ChartServiceService, private formBuilder: FormBuilder,
    private adminService: AdminService,public snackBar: MatSnackBar, private commonService: CommonService,
    public dialog: MatDialog) { 
      
    }

  ngOnInit() {
    //this.commonService.modifyMenuActive('bibleinfo');
    this.registerForm = this.formBuilder.group({
      date: ['', Validators.required],
      name: ['', Validators.required],
      books: ['', Validators.required],
      chapter: ['', Validators.required],
      fromVerse: ['', Validators.required],
      toVerse: ['', Validators.required]
    });

    

    this.adminService.getParticipantsInfo().subscribe(data => {
      this.nameData = data.map(f => f.name);
      this.filteredNames = this.registerForm.controls['name'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
    });

    
    

    this.filteredBooks = this.registerForm.controls['books'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.listOfBooks.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterName(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.nameData.filter(option => option.toLowerCase().includes(filterValue));
  }

  addBibleDetails() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  onSave() {
    
    var createDailyData = <DailyData> {
      name: this.registerForm.get('name').value,
      date: this.registerForm.controls.date.value,
      portion: this.registerForm.get('books').value,
      chapter: this.registerForm.controls.chapter.value,
      fromVerses: this.registerForm.controls.fromVerse.value,
      toVerses: this.registerForm.controls.toVerse.value,
      uniqueId: ""
    };

    this.chartServiceService.postBibleInfo(createDailyData)
      .subscribe(data => {
        createDailyData.uniqueId = data;
        console.log("successfully saved");
        this.onReset();
        this.successSnackBar();
      });
      
  }

  onReset() {
    this.submitted = false;
    this.registerForm.controls.chapter.setValue('');
    this.registerForm.controls.fromVerse.setValue('');
    this.registerForm.controls.toVerse.setValue('');
    this.registerForm.controls.date.setValue('');
    this.registerForm.get('books').setValue('');
    this.registerForm.get('name').setValue('');
  }


rowTobeDeleted: string


onDeleteRows(): void {
  
}

selectedAutoCompleteName(value): void {
  console.log('selected value '+value)
    this.registerForm.controls.name =value;
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

openNameDialog(): void  {
  const dialogRef = this.dialog.open(AutoCompleteDialogComponent, {
    width: '250px',
    data: {name: this.name, animal: ""}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    
  });
}


}
