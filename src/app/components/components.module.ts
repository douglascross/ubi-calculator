import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitizensChartComponent } from './citizens-chart/citizens-chart.component';
import { SegmentsTableComponent } from './segments-table/segments-table.component';



@NgModule({
  declarations: [CitizensChartComponent, SegmentsTableComponent],
  imports: [
    CommonModule
  ],
  exports: [CitizensChartComponent, SegmentsTableComponent]
})
export class ComponentsModule { }
