import { Component, OnInit, Inject, EventEmitter, ViewChild, Output, Input } from '@angular/core';
import { Meeting } from 'src/app/model/Meeting';
import { AdminService } from 'src/app/service/admin.service';
import { DOCUMENT } from '@angular/common';
import { NameModel } from '../../model/NameModel';

@Component({
  selector: 'app-meetingdatatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class MeetingDatatableComponent implements OnInit { 

  MEETING_DATA: Meeting[];
  Temp_MEETING_DATA: Meeting[];
  allNames: NameModel[] = [];

  @Output() rowValueMeeting: EventEmitter<Meeting> =   new EventEmitter();

  constructor(private adminService: AdminService) { 
    console.log("constructor calling")
  }

  ngOnInit() {
    this.adminService.viewMeetingInfo().subscribe(data=>{
      console.log("on init calling "+data[0].uniqueId)
      this.MEETING_DATA = data;
      this.Temp_MEETING_DATA = data;
      this.MEETING_DATA.forEach(f=>{
        f.mocModel=[];
        f.arrangementsModel=[];
        f.worshipersModel=[];
        f.musiciansModel=[];
        f.singersModel=[];
        f.testimonyModel=[];
        f.wogModel=[];
        f.othersModel=[];
      })
      this.adminService.getProfiles().subscribe(data1 => {
        let value: NameModel = {
          name: "All",
          uniqueId: "1000"
        }
        this.allNames.push(value)

        data1.forEach(f => {  
          let value: NameModel = {
            name: f.name,
            uniqueId: f.uniqueId
          }
          this.allNames.push(value)
        })
        this.sendNameAndUniqueId(this.allNames);
      })
    })
  }

  sendNameAndUniqueId(nameModel: NameModel[]){

    for(let i=0;i< this.MEETING_DATA.length;i++){
      this.setNameandUniqueId(this.MEETING_DATA[i].mocModel, this.MEETING_DATA[i].moc,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].arrangementsModel, this.MEETING_DATA[i].arrangements,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].singersModel, this.MEETING_DATA[i].singers,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].worshipersModel, this.MEETING_DATA[i].worshipers,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].musiciansModel, this.MEETING_DATA[i].musicians,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].testimonyModel, this.MEETING_DATA[i].testimony,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].wogModel, this.MEETING_DATA[i].wog,nameModel);
      this.setNameandUniqueId(this.MEETING_DATA[i].othersModel, this.MEETING_DATA[i].others,nameModel);
    }
    
}

setNameandUniqueId(valueModel: NameModel[], value: [string], nameModel: NameModel[]): void {
      value.forEach(element=>{
    let name= nameModel.filter(id=>id.uniqueId==element).map(name=>name.name).toString();
    let newNameModel:NameModel={
      name: name,
      uniqueId: element
    }
    console.log("checking "+newNameModel)
    valueModel.push(newNameModel)
  })
}

  selectRow(row: Meeting) {
    //this.rowValueMeeting = new EventEmitter();
    console.log("this unique id "+row.uniqueId)
    console.log("temp uniqu "+this.Temp_MEETING_DATA[0].uniqueId)
    for(let i=0;i<this.Temp_MEETING_DATA.length;i++) {
      if(row.uniqueId==this.Temp_MEETING_DATA[i].uniqueId) {
       return this.rowValueMeeting.emit(this.Temp_MEETING_DATA[i]);
      }
    }
    
  }

  UpdateRowValues(meeting, uniqueId) {
    console.log("getting updated")
    for(let i=0;i< this.MEETING_DATA.length;i++){
      if(this.MEETING_DATA[i].uniqueId==uniqueId) {
        this.MEETING_DATA[i].date = meeting.date;
        this.MEETING_DATA[i].moc = meeting.moc;
        this.MEETING_DATA[i].mocModel = meeting.mocModel;
        this.MEETING_DATA[i].arrangements = meeting.arrangements;
        this.MEETING_DATA[i].arrangementsModel = meeting.arrangementsModel;
        this.MEETING_DATA[i].worshipers = meeting.worshipers;
        this.MEETING_DATA[i].worshipersModel = meeting.worshipersModel;
        this.MEETING_DATA[i].musicians = meeting.musicians;
        this.MEETING_DATA[i].musiciansModel = meeting.musiciansModel;
        this.MEETING_DATA[i].singers = meeting.singers
        this.MEETING_DATA[i].singersModel = meeting.singersModel
        this.MEETING_DATA[i].songs = meeting.songs
        this.MEETING_DATA[i].testimony = meeting.testimony
        this.MEETING_DATA[i].testimonyModel = meeting.testimonyModel
        this.MEETING_DATA[i].wog = meeting.wog
        this.MEETING_DATA[i].wogModel = meeting.wogModel
        this.MEETING_DATA[i].aboutWog = meeting.aboutWog
        this.MEETING_DATA[i].others = meeting.others
        this.MEETING_DATA[i].othersModel = meeting.othersModel
        this.MEETING_DATA[i].othersAbout = meeting.othersAbout
        this.MEETING_DATA[i].remarks = meeting.remarks
        this.MEETING_DATA[i].picsUrl = meeting.picsUrl
        this.MEETING_DATA[i].picsModel = meeting.picsModel
      }
    }
    
  }

  saveRowValues(meeting) {
    if(this.MEETING_DATA==null) {
      this.MEETING_DATA=[];
    }
    this.MEETING_DATA.push(meeting);
  }

  deleteRowValues(uniqueId) {
    for(let i=0;i< this.MEETING_DATA.length;i++){
      if(this.MEETING_DATA[i].uniqueId==uniqueId) {
        this.MEETING_DATA.splice(i,1)
        return;
      }
    }
    
  }


  getListOfPicsUrl(uniqueId) {
    console.log("getting pics")
    for(let i=0;i< this.MEETING_DATA.length;i++){
      if(this.MEETING_DATA[i].uniqueId==uniqueId) {
        return this.MEETING_DATA[i].picsUrl;
      }
    }
  }

}
