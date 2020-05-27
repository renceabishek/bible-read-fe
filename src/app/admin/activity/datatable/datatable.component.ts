import { Component, OnInit, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { Activity } from 'src/app/model/Activity';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AdminService } from 'src/app/service/admin.service';
import { DOCUMENT } from '@angular/common';
import { NameModel } from '../../model/NameModel';

@Component({
  selector: 'app-activityDatatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class ActivityDatatableComponent implements OnInit {

  ELEMENT_DATA: Activity[] 
  allNames: NameModel[] = [];

  displayedColumns: string[] = ['DATE', 'TITLE'];
  dataSource = new MatTableDataSource<Activity>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Output() rowValue: EventEmitter<Activity> =   new EventEmitter();

  constructor(private adminService: AdminService,  @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.adminService.viewActivityInfo().subscribe(data=>{
      this.ELEMENT_DATA = data;
      this.ELEMENT_DATA.forEach(f=>{
        f.organizedByModel=[];
        f.participatedByModel=[];
        f.helpedByModel=[];
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

        for(let i=0;i< this.ELEMENT_DATA.length;i++){
          this.ELEMENT_DATA[i].participatedBy.forEach(participate=>{
            let name= nameModel.filter(id=>id.uniqueId==participate).map(name=>name.name).toString();
            let newNameModel:NameModel={
              name: name,
              uniqueId: participate
            }
            this.ELEMENT_DATA[i].participatedByModel.push(newNameModel)
          })
          this.ELEMENT_DATA[i].organizedBy.forEach(organize=>{
            let name= nameModel.filter(id=>id.uniqueId==organize).map(name=>name.name).toString();
            let newNameModel:NameModel={
              name: name,
              uniqueId: organize
            }
            this.ELEMENT_DATA[i].organizedByModel.push(newNameModel)
          })
          this.ELEMENT_DATA[i].helpedBy.forEach(help=>{
            let name= nameModel.filter(id=>id.uniqueId==help).map(name=>name.name).toString();
            let newNameModel:NameModel={
              name: name,
              uniqueId: help
            }
            this.ELEMENT_DATA[i].helpedByModel.push(newNameModel)
          })
          console.log("checking.....")
        }
        this.dataSource = new MatTableDataSource<Activity>(this.ELEMENT_DATA);
        
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
        this.ELEMENT_DATA[i].participatedByModel = activity.participatedByModel
        this.ELEMENT_DATA[i].organizedByModel = activity.organizedByModel
        this.ELEMENT_DATA[i].helpedByModel = activity.helpedByModel
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
