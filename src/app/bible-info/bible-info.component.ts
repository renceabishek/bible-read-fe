import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartServiceService } from '../chart-service.service';
import { DailyData } from '../model/DailyData';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, catchError, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { AdminService } from '../service/admin.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

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
    private adminService: AdminService,public snackBar: MatSnackBar) { 

    }

  ngOnInit() {

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


}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];