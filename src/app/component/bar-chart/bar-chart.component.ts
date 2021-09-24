import { Component } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { single } from '../../models/data';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  single: any[];
  view = [700, 400] as [number, number];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme = {
    name: 'myScheme',
    selectable: false,
    group: ScaleType.Time,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    this.single = single;
  }

  onSelect(data: any) {}

  onActivate(data: any): void {}

  onDeactivate(data: any): void {}
}
