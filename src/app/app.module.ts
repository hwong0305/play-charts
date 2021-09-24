import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BarChartComponent } from './component/bar-chart/bar-chart.component';
import { CustomDashboardComponent } from './component/custom-dashboard/custom-dashboard.component';
import { CustomBarChartComponent } from './component/custom-bar-chart/custom-bar-chart.component';
import { HorizontalBarChartComponent } from './component/util/horizontal-bar-chart/horizontal-bar-chart.component';
import { ChartLabelComponent } from './component/util/chart-label/chart-label.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BarChartComponent,
    CustomDashboardComponent,
    CustomBarChartComponent,
    HorizontalBarChartComponent,
    ChartLabelComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, NgxChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
