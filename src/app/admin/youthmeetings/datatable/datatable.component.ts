import { Component, OnInit, Inject, EventEmitter, ViewChild, Output } from '@angular/core';
import { Meeting } from 'src/app/model/Meeting';
import { AdminService } from 'src/app/service/admin.service';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-meetingdatatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class MeetingDatatableComponent implements OnInit { 

  ELEMENT_DATA: Meeting[];
  dataSource = new MatTableDataSource<Meeting>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Output() rowValue: EventEmitter<Meeting> =   new EventEmitter();

  constructor(private adminService: AdminService,  @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.adminService.viewMeetingInfo().subscribe(data=>{
      this.ELEMENT_DATA = data;
      this.dataSource = new MatTableDataSource<Meeting>(this.ELEMENT_DATA);
    })
  }

  selectRow(row) {
    console.log("row values emit "+row.others)
    this.rowValue.emit(row);
  }

  UpdateRowValues(meeting, uniqueId) {
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        this.ELEMENT_DATA[i].date = meeting.date;
        this.ELEMENT_DATA[i].moc = meeting.moc;
        this.ELEMENT_DATA[i].arrangements = meeting.arrangements;
        this.ELEMENT_DATA[i].worshipers = meeting.worshipers;
        this.ELEMENT_DATA[i].musicians = meeting.musicians;
        this.ELEMENT_DATA[i].singers = meeting.singers
        this.ELEMENT_DATA[i].songs = meeting.songs
        this.ELEMENT_DATA[i].testimony = meeting.testimony
        this.ELEMENT_DATA[i].wog = meeting.wog
        this.ELEMENT_DATA[i].aboutWog = meeting.aboutWog
        this.ELEMENT_DATA[i].others = meeting.others
        this.ELEMENT_DATA[i].othersAbout = meeting.othersAbout
        this.ELEMENT_DATA[i].remarks = meeting.remarks
        this.ELEMENT_DATA[i].picsUrl = meeting.picsUrl
        this.ELEMENT_DATA[i].picsModel = meeting.picsModel
      }
    }
    
  }

  saveRowValues(meeting) {
    if(this.ELEMENT_DATA==null) {
      this.ELEMENT_DATA=[];
    }
    this.ELEMENT_DATA.push(meeting);
  }

  deleteRowValues(uniqueId) {
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        this.ELEMENT_DATA.splice(i,1)
        return;
      }
    }
    
  }


  getListOfPicsUrl(uniqueId) {
    for(let i=0;i< this.ELEMENT_DATA.length;i++){
      if(this.ELEMENT_DATA[i].uniqueId==uniqueId) {
        return this.ELEMENT_DATA[i].picsUrl;
      }
    }
  }

}
