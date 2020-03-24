import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DialogData } from '../../auto-complete-dialog/auto-complete-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-skill-box',
  templateUrl: './skill-box.component.html',
  styleUrls: ['./skill-box.component.css']
})
export class SkillBoxComponent implements OnInit {

   ELEMENT_DATA: PeriodicElement[] = [
    {skills: 'Singing'},
    {skills: 'Dancing'},
    {skills: 'Guitarist'},
    {skills: 'Pianist'},
    {skills: 'Drawing'},
    {skills: 'Worship'},
    {skills: 'Gospel Sharing'},
    {skills: 'Human Fishers'},
    {skills: 'MOC'},
    {skills: 'Conducting Games'},
    {skills: 'Activity Gospel'}
  ];

  displayedColumns: string[] = ['select', 'skills'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(public dialogRef: MatDialogRef<SkillBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.skills + 1}`;
  }

}

export interface PeriodicElement {
  skills: string;
}
