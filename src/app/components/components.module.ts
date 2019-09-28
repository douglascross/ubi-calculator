import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WealthSegmentsChart } from './wealth-segment-chart/wealth-segment-chart.component';
import { SegmentsTableComponent } from './segments-table/segments-table.component';
import { WealthGraphicComponent } from './wealth-graphic/wealth-graphic.component';
import { BadgeComponent } from './badge/badge.component';
import { TaxFormComponent } from './tax-form/tax-form.component';



@NgModule({
  declarations: [
    WealthSegmentsChart,
    SegmentsTableComponent,
    WealthGraphicComponent,
    BadgeComponent,
    TaxFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    WealthSegmentsChart,
    SegmentsTableComponent,
    WealthGraphicComponent,
    BadgeComponent,
    TaxFormComponent
  ]
})
export class ComponentsModule { }
