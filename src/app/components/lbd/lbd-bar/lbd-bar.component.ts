import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartLabel } from '../lbd-pie/lbd-pie.component';
import * as CanvasJS from '../../../../assets/charts/canvasjs.min';
@Component({
  selector: 'lbd-bar',
  templateUrl: './lbd-bar.component.html' 
})
export class LbdBarComponent implements OnInit ,AfterViewInit {
  static currentId = 1;

  @Input()
  public title: string = "";
  @Input()
  public className: string;

  @Input()
  public subtitle: string;

  @Input()
  public chartClass: string;

  @Input()
  public chartData: any;

  @Input()
  public chartOptions: any;

  @Input()
  public chartResponsive: any[];
 
  @Input()
  public labels: ChartLabel[];

  public chartId: string;
  constructor() { }
  ngAfterViewInit(): void {    
   // new Chartist.Bar(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
   this.loadChart();
  }

  ngOnInit() {
    this.chartId = `lbd-chart-bar-${LbdBarComponent.currentId++}`;
    if(this.chartOptions==null|| this.chartOptions == {} ) {
      this.chartOptions =  {
        // showPoint: false,
        // lineSmooth: Chartist.Interpolation.none(),
      }
    }
  }

  loadChart(){
    CanvasJS.addColorSet("inforapTheme",
      ["#7c4dff",
      "#0091da",
      "#ff5733",
      "#00a3a1",
      "#00338d",
      "#1F77D0",
      "#5e5e5e",
      "#FFA534",
      "#23BFAA",
      "#FAA586",       
     ]); 
     var chart = new CanvasJS.Chart(this.chartId, {
      animationEnabled: true,
      exportEnabled: true,
      colorSet:  "inforapTheme",
      title:{
        text: this.title
      },
      axisY: {
        title: "Recursos"
      },
      data: [{        
        type: "column",  
        showInLegend: false, 
          dataPoints:  this.chartData
      }]
    });
    chart.render(); 
  }

}
