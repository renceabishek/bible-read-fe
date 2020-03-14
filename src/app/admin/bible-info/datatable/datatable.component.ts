import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DailyData } from 'src/app/model/DailyData';
import { AdminService } from 'src/app/service/admin.service';
import { DOCUMENT } from '@angular/common';

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

  @Output() rowValue: EventEmitter<DailyData> =   new EventEmitter();

  constructor(private adminService: AdminService,  @Inject(DOCUMENT) private document: Document) {
    
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.adminService.viewBibleInfo().subscribe(data=>{
      this.ELEMENT_DATA = data;
      this.dataSource = new MatTableDataSource<DailyData>(this.ELEMENT_DATA);
    })
  }

  selectRow(row) {
    this.rowValue.emit(row);
  }

  UpdateRowValues(dailyData, uniqueId) {
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        this.ELEMENT_DATA[i].name = dailyData.name;
        this.ELEMENT_DATA[i].date = dailyData.date;
        this.ELEMENT_DATA[i].portion = dailyData.portion;
        this.ELEMENT_DATA[i].chapter = dailyData.chapter;
        this.ELEMENT_DATA[i].fromVerses = dailyData.fromVerses;
        this.ELEMENT_DATA[i].toVerses = dailyData.toVerses;
      }
    }
    
  }

  saveRowValues(dailyData) {
    this.ELEMENT_DATA.push(dailyData);
  }

  deleteRowValues(uniqueId) {
    let deldailyData: DailyData;
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        this.ELEMENT_DATA.splice(i,1)
        return;
      }
    }
    
  }

}
