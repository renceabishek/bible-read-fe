import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-auto-complete-dialog',
  templateUrl: './auto-complete-dialog.component.html',
  styleUrls: ['./auto-complete-dialog.component.css']
})
export class AutoCompleteDialogComponent implements OnInit {

  filteredNames: any;
  constructor(
    public dialogRef: MatDialogRef<AutoCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private adminService: AdminService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.adminService.getProfiles().subscribe(data => {
      // this.nameData = data.map(f => f.name);
      // this.filteredNames = this.registerForm.controls['name'].valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => this._filterName(value))
      //   );
    });
  }

}

export interface DialogData {
  animal: string;
  name: string;
}
