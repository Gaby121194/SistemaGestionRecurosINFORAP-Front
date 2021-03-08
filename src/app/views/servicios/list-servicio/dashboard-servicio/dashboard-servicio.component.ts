import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LbdBarComponent } from 'src/app/components/lbd/lbd-bar/lbd-bar.component';
import { Servicio } from 'src/app/core/models/servicio';
import { ServiciosService } from 'src/app/core/services/servicios.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import * as jsPDF from 'jspdf'; 
import { LbdLineComponent } from 'src/app/components/lbd/lbd-line/lbd-line.component';
import { LbdPieComponent } from 'src/app/components/lbd/lbd-pie/lbd-pie.component';

@Component({
  selector: 'app-dashboard-servicio',
  templateUrl: './dashboard-servicio.component.html'
})
export class DashboardServicioComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dateValidator: DateValidator,
    private datePipe: DatePipe,
    private servicioService: ServiciosService,
    private cd: ChangeDetectorRef) { }
  @ViewChild("barResources") barResources : LbdBarComponent;
  @ViewChild("lineActives") lineActives : LbdLineComponent;
  @ViewChild("pieActives") pieActives : LbdPieComponent;
  @ViewChild("pieEnded") pieEnded : LbdPieComponent;

  services: Array<any>;
  isLoading = true;

  barCharData: {};
  barCharOptions: {} = {};

  lineChartData: {};
  lineChartOptions: {};
  lineChartLabels: {};

  pieChartData: {};
  pieChartOptions: {} = {};
  pieChartLabels: {}[] = [];

  pieChartData2: {};
  pieChartOptions2: {} = {};
  pieChartLabels2: {}[] = [];

  formGroup: FormGroup;
  submitted = false;
  async ngOnInit() {
    this.services = await this.listServicios();
    this.loadForm();
    await this.loadCharts();
    this.isLoading = false;
  }
  loadForm() {
    let fechaInicioFrom = this.datePipe.transform(new Date().setFullYear(new Date().getFullYear() - 1), 'dd-MM-yyyy');
    let fechaInicioTo = this.datePipe.transform(new Date(), 'dd-MM-yyyy')
    this.formGroup = this.fb.group({
      idServicio: this.services[0]?.key,
      nombre: '',
      fechaInicioFrom: fechaInicioFrom,
      fechaInicioTo: [fechaInicioTo, this.dateValidator.mustBeMajor("fechaInicioFrom")],
    });
  }

  async onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.isLoading = true;
      await this.loadCharts();
      this.isLoading = false;
    }
  }
  async clear() {
    this.submitted = false;
    this.loadForm();
    this.cd.detectChanges();
    this.isLoading = true;
    await this.loadCharts();
    this.isLoading = false;
  }
  exportPDF(){
    var form = this.formGroup.value;
    var canvasbarResources =  document.getElementById(this.barResources.chartId).getElementsByTagName("canvas")[0] ;
    var canvaslineActives =  document.getElementById(this.lineActives.chartId).getElementsByTagName("canvas")[0] ;
    var canvaspieActives =  document.getElementById(this.pieActives.chartId).getElementsByTagName("canvas")[0] ;
    var canvaspieEnded =  document.getElementById(this.pieEnded.chartId).getElementsByTagName("canvas")[0] ;
    var filters = document.getElementById("filters");
    // var dataURL = canvas.toDataURL();
    var pdf = new jsPDF();
    var today = this.datePipe.transform(new Date(),'dd-MM-yyyy')
    pdf.text("Generado: " +  today, 10, 10, "left");
    pdf.text("Desde: " + form.fechaInicioFrom, 10, 20, "left");
    pdf.text("Hasta: " + form.fechaInicioTo, 10, 30, "left");
    pdf.addImage(canvasbarResources.toDataURL(), 'JPEG', 0, 40);
    pdf.addPage()
    pdf.addImage(canvaslineActives.toDataURL(), 'JPEG', 0,0);
    pdf.addPage()
    pdf.addImage(canvaspieActives.toDataURL(), 'JPEG', 0, 0);
    pdf.addPage()
    pdf.addImage(canvaspieEnded.toDataURL(), 'JPEG', 0, 0);
    pdf.save("download.pdf");
  }


  async loadCharts() {
    var data = this.formGroup.value;
    await this.loadQuantityRrhhGropuedMonth(data);

    let quantityActivesGroupedMonth = await this.servicioService.getActiveServicesGroupedByMonths(data.fechaInicioFrom, data.fechaInicioTo).toPromise();
    let serviciosActivosInactivos = await this.servicioService.getServiciosActivosInactivos(data.fechaInicioFrom, data.fechaInicioTo).toPromise();
    let serviciosInactivosMotivos = await this.servicioService.getServiciosInactivosMotivos(data.fechaInicioFrom, data.fechaInicioTo).toPromise();

    if (quantityActivesGroupedMonth && quantityActivesGroupedMonth.length > 0) {
      // this.lineChartData = {
      //   // A labels array that can contain any sort of values
      //   labels: quantityActivesGroupedMonth.map(s => { return s.mes + '-' + String(s.anio).substr(-2) }),
      //   // Our series array that contains series objects or in this case series data arrays
      //   series: [
      //     quantityActivesGroupedMonth.map(s => { return Number(s.cantidad) })
      //   ]
      // }
      this.lineChartData = quantityActivesGroupedMonth.map(s=>{
        return {
          y : Number(s.cantidad),
          label : s.mes + '-' + String(s.anio).substr(-2)
        }
      })
      this.lineChartLabels = null;
      this.lineChartOptions = {};
    } else {
      this.lineChartData = null;
    }
    // CHART
    if (serviciosActivosInactivos && serviciosActivosInactivos.total != 0) {
      // this.pieChartData = {
      //   labels: [' ', ' '],
      //   series: [{ value: serviciosActivosInactivos.inactivos, className: 'fill-purple' }, { value: serviciosActivosInactivos.activos, className: 'fill-lightblue' }],
      // };
      this.pieChartData = [
        {y : serviciosActivosInactivos.activos *100 , label : 'En curso'},
        {y : serviciosActivosInactivos.inactivos *100 , label : 'Finalizados'}
      ]
      this.pieChartLabels = [
        { text: 'Finalizados', cssClass: 'color-purple', value: (serviciosActivosInactivos.inactivos * 100)},
        { text: 'Activos', cssClass: 'color-lightblue', value: (serviciosActivosInactivos.activos * 100)},
      ];
      this.pieChartOptions = {
        donut: true,
        donutSolid: true,
        donutWidth: '54%',
        startAngle: 0,
        showLabel: false
      }
    } else {
      this.pieChartData = null;
    }
    if (serviciosInactivosMotivos && serviciosInactivosMotivos.total != 0) {
      // this.pieChartData2 = {
      //   labels: [' ', ' '],
      //   series: [{ value: serviciosInactivosMotivos.fechaCumplida, className: 'fill-purple' },
      //   { value: serviciosInactivosMotivos.decisionPropia, className: 'fill-lightblue' },
      //   { value: serviciosInactivosMotivos.decisionCliente, className: 'fill-red' }],
      // };
      this.pieChartData2 = [
        {y : serviciosInactivosMotivos.fechaCumplida *100 , label : 'Fecha cumplida',markerColor: "#555"},
        {y : serviciosInactivosMotivos.decisionPropia *100 , label : 'Decisión propia'},
        {y : serviciosInactivosMotivos.decisionCliente *100 , label : 'Decisión del cliente'},
    
      ]
      this.pieChartLabels2 = [
        { text: 'Fecha cumplida', cssClass: 'color-purple', value: (serviciosInactivosMotivos.fechaCumplida * 100) },
        { text: 'Decisión propia', cssClass: 'color-lightblue', value: (serviciosInactivosMotivos.decisionPropia * 100) },
        { text: 'Decisión del cliente', cssClass: 'color-red', value: (serviciosInactivosMotivos.decisionCliente * 100) },
      ];
      this.pieChartOptions2 = {
        donut: true,
        donutSolid: true,
        donutWidth: '54%',
        startAngle: 0,
        showLabel: false
      }
    } else {
      this.pieChartData2 = null;
    }
  }
  async listServicios() {
    let result = await this.servicioService.list().toPromise();
    return result.map(s => {
      return {
        key: s.id,
        value: `${s.cliente.razonSocial} - ${s.nombre}`
      }
    })
  }
  async onServiceChange(event) {
    if (this.formGroup.valid) {
      this.loadQuantityRrhhGropuedMonth(this.formGroup.value);
    }
  }

  async loadQuantityRrhhGropuedMonth(data) {
    this.isLoading = true;
    let quantityRrhhGropuedMonth = await this.servicioService.getHumanResourcesGroupedByMonths(data.fechaInicioFrom, data.fechaInicioTo, data.idServicio).toPromise();
    if (quantityRrhhGropuedMonth && quantityRrhhGropuedMonth.length > 0) {
      // this.barCharData = {
      //   labels:
      //     quantityRrhhGropuedMonth.map(s => { return s.mes + '-' + String(s.anio).substr(-2) })
      //   ,
      //   series: [
      //     quantityRrhhGropuedMonth.map(s => { return Number(s.cantidad) })
      //   ]
      // };
      this.barCharData = quantityRrhhGropuedMonth.map(s=>{
        return {
          y :  Number(s.cantidad),
          label : s.mes + '-' + String(s.anio).substr(-2)
        }
      })
    } else {
      this.barCharData = null
    }
    this.isLoading = false;
  }
}
