import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DailyData } from 'src/app/model/DailyData';
import { AdminService } from 'src/app/service/admin.service';
import { DOCUMENT } from '@angular/common';
import { NameModel } from '../../model/NameModel';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {

  ELEMENT_DATA: DailyData[]
  Temp_ELEMENT_DATA: DailyData[]
  allNames: NameModel[] = [];

  displayedColumns: string[] = ['NAME', 'DATE', 'BOOKS', 'CHAPTER', 'FROM VERSE', 'TO VERSE'];
  dataSource = new MatTableDataSource<DailyData>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Output() rowValue: EventEmitter<DailyData> = new EventEmitter();

  constructor(private adminService: AdminService, @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.adminService.viewBibleInfo().subscribe(data => {
      this.Temp_ELEMENT_DATA = data;
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

  sendNameAndUniqueId(nameModel: NameModel[]) {
    for (let i = 0; i < this.Temp_ELEMENT_DATA.length; i++) {
      let pureName = nameModel.filter(f => f.uniqueId == this.Temp_ELEMENT_DATA[i].name)
        .map(f => f.name).toString();
      this.Temp_ELEMENT_DATA[i].pureName = pureName;
    }
    this.ELEMENT_DATA=this.Temp_ELEMENT_DATA;
  }

  selectRow(row) {
    this.rowValue.emit(row);
  }

  UpdateRowValues(dailyData, uniqueId) {
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      if (this.ELEMENT_DATA[i].uniqueId == uniqueId) {
        this.ELEMENT_DATA[i].name = dailyData.name;
        this.ELEMENT_DATA[i].date = dailyData.date;
        this.ELEMENT_DATA[i].portion = dailyData.portion;
        this.ELEMENT_DATA[i].chapter = dailyData.chapter;
        this.ELEMENT_DATA[i].fromVerses = dailyData.fromVerses;
        this.ELEMENT_DATA[i].toVerses = dailyData.toVerses;
        this.ELEMENT_DATA[i].pureName = dailyData.pureName;
      }
    }

  }

  saveRowValues(dailyData) {
    console.log("values--> "+dailyData.pureName)
    this.ELEMENT_DATA.push(dailyData);
  }

  deleteRowValues(uniqueId) {
    let deldailyData: DailyData;
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      if (this.ELEMENT_DATA[i].uniqueId == uniqueId) {
        this.ELEMENT_DATA.splice(i, 1)
        return;
      }
    }

  }

}
