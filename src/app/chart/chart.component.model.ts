export interface DataSet {
  name: string;
  data: string;
  list: string[];
  color: string;
}

export interface IChartPoint {
  time: string;
}

export type ChartPoint = IChartPoint & any;
