import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ChartType, LegendItem } from '../lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import * as jsPDF from 'jspdf'; 
 import { element } from 'protractor';
import { FillColorsEnum } from 'src/app/core/enums/fill-colors.enum';
import * as CanvasJS from '../../../../assets/charts/canvasjs.min';
//declare var CanvasJS : any;
 export interface ChartLabel {
  text: string;
  cssClass?: string;
  value?: string;
}
@Component({
  selector: 'lbd-pie',
  templateUrl: './lbd-pie.component.html'
})
export class LbdPieComponent implements OnInit, AfterViewInit {

  static currentId = 1;

  @Input()
  public title: string = "";

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
  @Input() labels: ChartLabel[];


  @Input()
  public withHr: boolean;
  @ViewChild('htmlData') htmlData:ElementRef;
  public chartId: string;
  svgUrl = "";
  constructor() { }
  ngAfterViewInit(): void {

    //new Chartist.Pie(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
    //this.svgUrl = this.svg2img();
   this.loadChart();
  }

  ngOnInit() {
    this.chartId = `lbd-chart-pie-${LbdPieComponent.currentId++}`;

  }
  downloadAsPDF() {
    // let DATA = this.htmlData.nativeElement;
    // let doc = new jsPDF('p','pt', 'a4');
    // doc.fromHTML(DATA.innerHTML,15,15);
    // doc.output('dataurlnewwindow');
    this.getPdf();
  }
  async getPdf() {
    //Get svg markup as string
    this.reFillColors();
    var svg = document.getElementById(this.chartId).innerHTML;
   
    if (svg)
      svg = svg.replace(/\r?\n|\r/g, '').trim();
  
      const canvas = document.createElement('canvas');
    // var context = canvas.getContext('2d');
    // const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
  
    //context.clearRect(0, 0, canvas.width, canvas.height);
   
    // let v =  Canvg.fromString(ctx, svg);
    // v.start();
    var imgData = canvas.toDataURL('image/png');
    let DATA = this.htmlData.nativeElement;
    // Generate PDF
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.addImage(imgData, 'PNG', 40, 40, 0, 0);
    doc.fromHTML(DATA.innerHTML,15,15);
     
    doc.save('test.pdf');
  
  }

  private reFillColors(){
    var purpleElements =  document.getElementsByClassName("fill-purple");
    var redElements =  document.getElementsByClassName("fill-red");
    var lightblueElements =  document.getElementsByClassName("fill-lightblue");
     for (let index = 0; index < purpleElements.length; index++) {      
      purpleElements[index].setAttribute("fill", FillColorsEnum.purple);
    }
    for (let index = 0; index < redElements.length; index++) {      
      redElements[index].setAttribute("fill", FillColorsEnum.red);
    }
    for (let index = 0; index < lightblueElements.length; index++) {      
      lightblueElements[index].setAttribute("fill", FillColorsEnum.lightblue);
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
        text:this.title,
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 17,
        yValueFormatString: "##0.00\"%\"",
        indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints:  this.chartData
      }]
    });
    chart.render();
  }
}
