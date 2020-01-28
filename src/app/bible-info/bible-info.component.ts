import { Component, OnInit } from '@angular/core';
import { ChartServiceService } from '../chart-service.service';
import { DailyData } from '../model/DailyData';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-bible-info',
  templateUrl: './bible-info.component.html',
  styleUrls: ['./bible-info.component.css']
})
export class BibleInfoComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;

  rowData: DailyData[];

  myControl = new FormControl();
  options: string[] = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes',
    'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'];
  filteredOptions: Observable<string[]>;

  name = '';
  date = '';
  portion = '';
  chapter = '';
  fromVerse = '';
  toVerse = '';

  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Date', field: 'date', sortable: true, filter: true },
    { headerName: 'Portion', field: 'portion', sortable: true, filter: true },
    { headerName: 'Chapter', field: 'chapter', sortable: true, filter: true },
    { headerName: 'From Verses', field: 'fromVerses', sortable: true, filter: true },
    { headerName: 'To Verses', field: 'toVerses', sortable: true, filter: true }
  ];



  constructor(private chartServiceService: ChartServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.chartServiceService.viewBibleInfo().subscribe(data => {
      this.rowData = data;
    })

    this.registerForm = this.formBuilder.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      books: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      //validator: MustMatch('password', 'confirmPassword')
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addBibleDetails() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

}
