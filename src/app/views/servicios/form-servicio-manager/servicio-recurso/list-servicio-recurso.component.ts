import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServicioRecurso, ServicioRecursoFilter } from 'src/app/core/models/servicio-recurso';
import { SharedService } from 'src/app/core/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { FormServicioRecursoComponent } from './form-servicio-recurso.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { TipoRecursoEnum } from 'src/app/core/enums/tipo-recurso.enum';
import { RecursoService } from 'src/app/core/services/recurso.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-list-servicio-recurso',
  templateUrl: './list-servicio-recurso.component.html'
})
export class ListServicioRecursoComponent implements OnInit {

  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    private recursoService: RecursoService,
    private dateValidator: DateValidator,
    private confirmService: DialogService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }
  filteredRecursoServicios: ServicioRecurso[];
  recursoServicios: ServicioRecurso[];
  id: any;
  page: number = 1;
  formGroup: FormGroup;
  submitted = false;
  hasErrors: boolean;
  tiposRecursos: {}[];
  async ngOnInit() {
  //  await this.sharedService.currentShare.toPromise().then(s=>this.id = s);
  //  console.log(this.id);
  
    await this.sharedService.currentShare.pipe(take(1)).subscribe(async x => {
      this.id = x
      await this.getRecursoServicios(this.id);
      this.loadFormGroup();
      this.listTiposRecursos();
      this.cd.detectChanges();
    });
  }

  async getRecursoServicios(_id) {
    if (_id && _id != 0)
      this.recursoServicios = await this.recursoService.listFromService(_id).toPromise();
  }
  delete(id) {
    this.confirmService.openConfirmDialog("¿Está seguro que desea desasignar el recurso al servicio?").afterClosed().subscribe(res => {
      if (res) {
        this.recursoService.removeServicioRecurso(id).subscribe(async s => {
          await this.getRecursoServicios(this.id)
          this.openSnackBar("El recurso ha sido desasignado correctamente");
        });
      }
    });
  }
  async onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      var filter = this.formGroup.value as ServicioRecursoFilter;
      this.recursoServicios = await this.recursoService.listFromServiceBy(this.id, filter).toPromise();
    }
  }
  async clear() {
    await this.getRecursoServicios(this.id);
    this.loadFormGroup();
    this.submitted = false;

    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }
  onCreate() {
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FormServicioRecursoComponent, {
      width: '50%',
      height: '75%',
      data: { idServicio: this.id }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result == true)
        await this.getRecursoServicios(this.id);
    });
  }

  loadFormGroup() {
    this.formGroup = this.fb.group({
      idTipoRecurso: null,
      creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")],
      creationDateTo: [null, this.dateValidator.mustBeMajor("creationDateFrom")]
    })
  }
  listTiposRecursos() {
    this.tiposRecursos = [
      { key: TipoRecursoEnum["Recurso Humano"], value: "Recursos Humanos" },
      { key: TipoRecursoEnum["Recurso Material"], value: "Recursos Materiales" }
    ]
  }

  exportToExcel() {
    if (this.recursoServicios.length > 0){
      let exportdata = this.recursoServicios.map(e => {
        return {
          "Fecha": e.fechaAsignado.split("T")[0],
          Descripción: e.recurso.descripcion,
          "Tipo": e.tipoRecurso.descripcion,
        }
      })
      this.excelService.exportAsExcelFile(exportdata, 'Recursos asignados', this.formGroup);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }
  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });

  }
}
