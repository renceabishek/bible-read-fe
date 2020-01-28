import { Component, OnInit, NgZone  } from '@angular/core';
import { TotalCounts } from '../model/TotalCounts';
import { ChartServiceService } from '../chart-service.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-totalcount',
  templateUrl: './totalcount.component.html',
  styleUrls: ['./totalcount.component.css']
})
export class TotalcountComponent {


  private chart: am4charts.XYChart;
  totalCounts: TotalCounts[];

  constructor(private zone: NgZone, private chartServiceService: ChartServiceService) {
    console.log('constructor');
    this.chartServiceService.getTotalCounts().subscribe(data=> {
      var newtotal=JSON.stringify(data);
      this.totalCounts = data;
      this.createChart();
      console.log("-data "+newtotal);
    });
   }

   

  createChart() {

    

    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      console.log("after "+this.totalCounts.values);
// Add data
chart.data = this.totalCounts;

// Create axes

let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "name";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;

categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
  if (target.dataItem && target.dataItem.index & 2) {
    return dy + 25;
  }
  return dy;
});

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "count";
series.dataFields.categoryX = "name";
series.name = "Count";
series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;

let columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;

      this.chart = chart;
    });

    console.log('atlast '+this.totalCounts);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }


}
