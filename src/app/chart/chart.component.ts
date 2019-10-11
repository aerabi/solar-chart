import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {MOCK_DATA} from './chart.component.data';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy {

  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
// Create chart instance
      const chart = am4core.create('chartdiv', am4charts.XYChart);

// Add data
      chart.data = MOCK_DATA;

// Set input format for the dates
      chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

// Create axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'date';
      series.tooltipText = '{value}';
      series.strokeWidth = 2;
      series.minBulletDistance = 15;

// Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = 'middle';
      series.tooltip.label.textValign = 'middle';

// Make bullets grow on hover
      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color('#fff');

      const bullethover = bullet.states.create('hover');
      bullethover.properties.scale = 1.3;

// Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = 'panXY';
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
      chart.scrollbarY = new am4core.Scrollbar();
      chart.scrollbarY.parent = chart.leftAxesContainer;
      chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      // chart.scrollbarX.series.push(series);
      chart.scrollbarX.parent = chart.bottomAxesContainer;

      chart.events.on('ready', () => {
        dateAxis.zoom({start: 0.79, end: 1});
      });
    });
  }

  ngOnDestroy() {
  this.zone.runOutsideAngular(() => {
    if (this.chart) {
      this.chart.dispose();
    }
  });
}

}
