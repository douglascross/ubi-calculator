import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitizensChartComponent } from './citizens-chart/citizens-chart.component';



@NgModule({
  declarations: [CitizensChartComponent],
  imports: [
    CommonModule
  ],
  exports: [CitizensChartComponent]
})
export class ComponentsModule { }
