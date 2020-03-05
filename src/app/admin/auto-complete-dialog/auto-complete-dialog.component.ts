import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-auto-complete-dialog',
  templateUrl: './auto-complete-dialog.component.html',
  styleUrls: ['./auto-complete-dialog.component.css']
})
export class AutoCompleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AutoCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export interface DialogData {
  animal: string;
  name: string;
}
