import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Servicio } from 'src/app/core/models/servicio';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormServicioManagerComponent } from '../form-servicio-manager/form-servicio-manager.component';
import { ServiciosService } from 'src/app/core/services/servicios.service';
import { FormServicioBajaComponent } from '../form-servicio-baja/form-servicio-baja.component';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-servicio',
  templateUrl: './list-servicio.component.html'
})
export class ListServicioComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private fb: FormBuilder, private cd: ChangeDetectorRef,
    private servicioService: ServiciosService,
    private excelService : ExcelService,
    private snackBar : MatSnackBar,
    private datePipe : DatePipe,
    private dateValidator: DateValidator,) { }

  servicios: Servicio[];
  formGroup: FormGroup;
  submitted: boolean = false;
  showDashboard: boolean = false;
  page = 1;
  hasErrors: boolean;
  ngOnInit(): void {
    this.listServicios();
    this.loadForm();
  }
  onCreate() {
    const dialogRef = this.dialog.open(FormServicioManagerComponent, {
      width: '100%',
      height: '90%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result==true)
      this.listServicios();
    });
  }
  async listServicios() {
    this.servicios = await this.servicioService.list().toPromise();
  }
  loadForm() {
    this.formGroup = this.fb.group({
      name: '',
      fechaInicioFrom: null,
      fechaInicioTo: [null, this.dateValidator.mustBeMajor("fechaInicioFrom")],
      fechaFinFrom: null,
      fechaFinTo: [null, this.dateValidator.mustBeMajor("fechaFinFrom")]
    });
  }
  edit(id) {
    const dialogRef = this.dialog.open(FormServicioManagerComponent, {
      width: '100%',
      height: '90%',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true)
      this.listServicios();
    });
  }

  delete(id) {
    const dialogRef = this.dialog.open(FormServicioBajaComponent, {
      width: '33%',
      height: '50%',
      data: { idServicio: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
        this.listServicios();
    });
  }
  async onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.servicios = await this.servicioService.listBy(this.formGroup.value).toPromise();
    }
  }
  clear() {
    this.loadForm();
    this.listServicios();
    this.cd.detectChanges();
    this.hasErrors = false;
  }
  goDashboard() {
    this.showDashboard = true;
  }
  goList() {
    this.showDashboard = false;
  }

  exportToExcel() {
    if (this.servicios.length > 0){
      let exportdata = this.servicios.map(e => {
        return {
          Nombre: e.nombre,
          "Nro. Contrato": e.nroContrato,
          "Fecha de inicio": e.fechaInicio.split("T")[0],
          "Fecha de fin": e.fechaInicio.split("T")[0],
          "En curso": e.active == true ? 'Sí ' : 'No',
          Cliente: e.cliente.razonSocial
        }
      })
      this.excelService.exportAsExcelFile(exportdata, 'Servicios', this.formGroup, true);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }
}
