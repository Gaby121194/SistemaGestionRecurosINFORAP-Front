import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartLabel } from '../lbd-pie/lbd-pie.component';
import * as jsPDF from 'jspdf';
import { FillColorsEnum } from 'src/app/core/enums/fill-colors.enum';
import * as CanvasJS from '../../../../assets/charts/canvasjs.min';

@Component({
  selector: 'lbd-line',
  templateUrl: './lbd-line.component.html'
})
export class LbdLineComponent implements OnInit, AfterViewInit {

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
  @ViewChild('htmlData') htmlData: ElementRef;

  constructor() { }
  ngAfterViewInit(): void {
   // new Chartist.Line(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
   this.loadChart();
  }

  ngOnInit() {
    this.chartId = `lbd-chart-line-${LbdLineComponent.currentId++}`;
    if (this.chartOptions == null || this.chartOptions == {}) {
      this.chartOptions = {
        showPoint: false,
        lineSmooth: Chartist.Interpolation.none(),
      }
    }
  }
  downloadAsPDF() {
    // let DATA = this.htmlData.nativeElement;
    // let doc = new jsPDF('p','pt', 'a4');
    // doc.fromHTML(DATA.innerHTML,15,15);
    // doc.output('dataurlnewwindow');
    this.getPdf();
  }
  getPdf() {
    //Get svg markup as string
    // this.reFillColors();
    var svg = document.getElementById(this.chartId).innerHTML;
    console.log(svg);
    if (svg)
      svg = svg.replace(/\r?\n|\r/g, '').trim();

    const canvas = document.createElement('canvas');
    // var context = canvas.getContext('2d');
    // const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    //context.clearRect(0, 0, canvas.width, canvas.height);

    // let v =  Canvg.fromString(ctx, svg);
    // v.start();
    // var imgData = canvas.toDataURL('image/png');
    let DATA = this.htmlData.nativeElement;
    // Generate PDF
    var doc = new jsPDF('p', 'pt', 'a4');
    // doc.addImage(imgData, 'PNG', 40, 40, 0, 0);
    doc.fromHTML(DATA.innerHTML, 15, 15);

    doc.save('test.pdf');

  }

  private reFillColors() {
    var purpleElements = document.getElementsByClassName("fill-purple");
    var redElements = document.getElementsByClassName("fill-red");
    var lightblueElements = document.getElementsByClassName("fill-lightblue");
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

  loadChart() {
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
      colorSet: "inforapTheme",
      title: {
        text: this.title
      },
      data: [{
        type: "line",
        indexLabelFontSize: 16,
        dataPoints: this.chartData
      }]
    });
    chart.render();

  }
}
