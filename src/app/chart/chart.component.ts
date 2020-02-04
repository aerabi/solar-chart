import {AfterViewInit, Component, Input, NgZone, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {DUMMY_JSON} from './chart.component.data';
import {ChartPoint, DataSet} from './chart.component.model';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() showSolarValues: boolean;
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadData();
  }

  private reloadData(): void {
    this.chart.data = this.loadData(DUMMY_JSON);
  }

  private loadChart() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      this.chart = am4core.create('chartdiv', am4charts.XYChart);
      const chart = this.chart;

      // Add data
      const loadedData = this.loadData(DUMMY_JSON);
      chart.data = loadedData;
      console.log(loadedData);

      // Set input format for the dates
      // chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
      chart.dateFormatter.inputDateFormat = 'HHmm';

      // Create date axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.fullWidthTooltip = true;

      // Create value axis
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Voltage';

      Object.keys(loadedData[0])
        .filter(key => key !== 'time')
        .forEach(key => {
          console.log(`Creating series ${key}`);

          // Create series
          const series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = key;
          series.dataFields.dateX = 'time';
          series.tooltipText = '{value}';
          series.strokeWidth = 2;
          series.minBulletDistance = 15;
          series.name = this.normalizeLegendName(key);
          series.showOnInit = true;

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

          if (key.includes('Solar in')) {
            // Create a horizontal scrollbar with previe and place it underneath the date axis
            chart.scrollbarX = new am4charts.XYChartScrollbar();
            // @ts-ignore
            chart.scrollbarX.series.push(series);
            chart.scrollbarX.parent = chart.bottomAxesContainer;
          }
        });

      // Add legend
      chart.legend = new am4charts.Legend();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  private filterDataSets(dataSets: DataSet[]): DataSet[] {
    return dataSets.filter(dataSet => {
      if (dataSet.name === 'time') {
        return true;
      }
      return !!(this.showSolarValues && (dataSet.name.includes('Solar') || dataSet.name.match(/i.*: Load/)));
    });
  }

  loadData(json: string): ChartPoint[] {
    const parsedJson: DataSet[] = this.filterDataSets(JSON.parse(json));
    const indexRange: number[] = [...Array(parsedJson[0].list.length)];
    const points: ChartPoint[] = indexRange.map(_ => ({ time: undefined }));
    parsedJson.forEach(dataset => {
      dataset.list.forEach((value, index) => {
        points[index][dataset.name] = (dataset.name === 'time' ? value : parseFloat(value));
      });
    });
    return points;
  }

  normalizeLegendName(name: string): string {
    return name.replace(/i[0-9]+:\s/, '');
  }

}
