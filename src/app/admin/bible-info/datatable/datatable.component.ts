import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DailyData } from 'src/app/model/DailyData';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {

  ELEMENT_DATA: DailyData[]

  displayedColumns: string[] = ['NAME', 'DATE', 'BOOKS', 'CHAPTER','FROM VERSE','TO VERSE'];
  dataSource = new MatTableDataSource<DailyData>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.adminService.viewBibleInfo().subscribe(data=>{
      this.ELEMENT_DATA = data;
      this.dataSource = new MatTableDataSource<DailyData>(this.ELEMENT_DATA);
    })
  }

  selectRow(row) {
    console.log(row.name);
  }

}
