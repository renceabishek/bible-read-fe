import { Component, OnInit, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { Activity } from 'src/app/model/Activity';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-activityDatatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class ActivityDatatableComponent implements OnInit {

  ELEMENT_DATA: Activity[] 

  displayedColumns: string[] = ['DATE', 'TITLE'];
  dataSource = new MatTableDataSource<Activity>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Output() rowValue: EventEmitter<Activity> =   new EventEmitter();

  constructor(private adminService: AdminService,  @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.adminService.viewActivityInfo().subscribe(data=>{
      this.ELEMENT_DATA = data;
      this.dataSource = new MatTableDataSource<Activity>(this.ELEMENT_DATA);
    })
  }


  selectRow(row) {
    this.rowValue.emit(row);
  }

  UpdateRowValues(activity, uniqueId) {
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        this.ELEMENT_DATA[i].date = activity.date;
        this.ELEMENT_DATA[i].title = activity.title;
        this.ELEMENT_DATA[i].content = activity.content;
        this.ELEMENT_DATA[i].helpedBy = activity.helpedBy;
        this.ELEMENT_DATA[i].organizedBy = activity.organizedBy;
        this.ELEMENT_DATA[i].participatedBy = activity.participatedBy
        this.ELEMENT_DATA[i].picsUrl = activity.picsUrl
        this.ELEMENT_DATA[i].picsModel = activity.picsModel
      }
    }
    
  }

  saveRowValues(dailyData) {
    this.ELEMENT_DATA.push(dailyData);
  }

  deleteRowValues(uniqueId) {
    let delActivityData: Activity;
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        this.ELEMENT_DATA.splice(i,1)
        return;
      }
    }
    
  }

  getListOfPicsUrl(uniqueId) {
    console.log("getting pics")
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        return this.ELEMENT_DATA[i].picsUrl;
      }
    }
  }

}
