
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LbdChartComponent } from './lbd-chart/lbd-chart.component';
import { LbdPieComponent } from './lbd-pie/lbd-pie.component';
import { LbdLineComponent } from './lbd-line/lbd-line.component';
import { LbdBarComponent } from './lbd-bar/lbd-bar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    LbdChartComponent,
    LbdPieComponent,
    LbdLineComponent,
    LbdBarComponent

  ],
  exports: [
    LbdChartComponent,
    LbdPieComponent,
    LbdLineComponent,
    LbdBarComponent

  ]
})
export class LbdModule { }
