import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DialogData } from '../../auto-complete-dialog/auto-complete-dialog.component';
import { PeriodicElement } from '../skill-box/skill-box.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-name-box',
  templateUrl: './name-box.component.html',
  styleUrls: ['./name-box.component.css']
})
export class NameBoxComponent implements OnInit {

  ELEMENT_DATA: PeriodicElementName[] = this.data.name;
  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<PeriodicElementName>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElementName>(true, []);

  constructor(public dialogRef: MatDialogRef<NameBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataName) {
      console.log("element values "+this.ELEMENT_DATA)
     }

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
  checkboxLabel(row?: PeriodicElementName): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogDataName {
  name: any;
}

export interface PeriodicElementName {
name: string
}
