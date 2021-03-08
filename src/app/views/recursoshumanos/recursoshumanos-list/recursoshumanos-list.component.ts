import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RecursosHumanosService } from 'src/app/core/services/recursos-humanos.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { ExcelService } from 'src/app/core/services/excel.service';
import { RecursoHumano } from 'src/app/core/models/recurso-humano';
import { RecursosHumanosFormComponent } from '../recursoshumanos-form/recursoshumanos-form.component';
import { ListRecursosasignadosComponent } from '../../recursosasignados/list-recursosasignados/list-recursosasignados.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RrhhDatosPersonalesComponent } from '../rrhh-datos-personales/rrhh-datos-personales.component';

@Component({
  selector: 'app-recursoshumanos-list',
  templateUrl: './recursoshumanos-list.component.html',
  styleUrls: ['./recursoshumanos-list.component.scss']
})
export class RecursosHumanosListComponent implements OnInit {

  recursosHumanos: RecursoHumano[];
  filteredRecursosHumanos: RecursoHumano[];
  formGroup: FormGroup;
  formGroupRecursos: FormGroup;
  submitted = false;
  page: number = 1;
  hasErrors: boolean;
  constructor(
    private basicService: RecursosHumanosService,
    private modalService: MatDialog,
    private confirmService: DialogService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dateValidator: DateValidator,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

  async ngOnInit(): Promise<void> {

    this.loadForm();
    this.listRecursosHumanos();
    this.cd.detectChanges();
  }

  listRecursosHumanos() {
    this.basicService.list().subscribe(s => this.recursosHumanos = this.filteredRecursosHumanos = s)
  }

  async GetRecursosHumanos() {
    return new Promise<{}[]>(resolve => {
      this.basicService.list().subscribe(s => {
        resolve(s.map(e => {
          return {
            key: e.id,
            value: e.cuil
          }
        }));
        return;
      })
    })
  }

  onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.basicService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredRecursosHumanos = s;
        });
    }
  }

  clear() {
    this.listRecursosHumanos()
    this.loadForm();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: '',
      creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")],
      creationDateTo: [null, this.dateValidator.mustBeMajor("creationDateFrom")]
    })
  }

  create() {
    const dialogRef = this.modalService.open(RecursosHumanosFormComponent, {
      disableClose: false,
      autoFocus: true,
      width: "60%",
      height: "90%",
    });

    dialogRef.afterClosed().subscribe(s => {
      this.basicService.listBy(this.formGroup.value).subscribe(s =>
        this.recursosHumanos = this.filteredRecursosHumanos = s);
    });
  }



  edit(id: number) {
    const dialogRef = this.modalService.open(RecursosHumanosFormComponent, {
      disableClose: false,
      autoFocus: true,
      width: "60%",
      height: "90%",
    });
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(s => {
      this.basicService.listBy(this.formGroup.value).subscribe(s =>
        this.recursosHumanos = this.filteredRecursosHumanos = s);
    });

  }

  delete(id: number) {
    this.confirmService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if (res) {
        this.basicService.delete(id).subscribe(s => {
          this.openSnackBar("El recurso humano fue eliminado correctamente")
          this.basicService.listBy(this.formGroupRecursos.value).subscribe(
            s => { 
              
              this.filteredRecursosHumanos = s; }
          )
        }, () => this.openSnackBar("No es posible eliminar un recurso con asignaciones")
        );
      }
    });
  }

  showAsignRecursos(item: RecursoHumano) {
    const dialogRef = this.modalService.open(ListRecursosasignadosComponent, {
      disableClose: false,
      autoFocus: true,
      width: "80%",
      height: "90%",
    });
    dialogRef.componentInstance.idRecurso = item.idRecurso;
    dialogRef.componentInstance.id = item.id;
    dialogRef.componentInstance.nameFather = `${item.nombre} ${item.apellido}`;

    dialogRef.afterClosed().subscribe(s => {
      this.basicService.listBy(this.formGroup.value).subscribe(s =>
        this.recursosHumanos = this.filteredRecursosHumanos = s);
    });

  }

  view(id: number) {
    const dialogRef = this.modalService.open(RrhhDatosPersonalesComponent, {
      disableClose: false,
      autoFocus: false,
      width: "60%",
      height: "75%",
    });
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(s => {
      this.basicService.listBy(this.formGroup.value).subscribe(s =>
        this.recursosHumanos = this.filteredRecursosHumanos = s);
    });

  }
  exportToExcel() {
    if (this.filteredRecursosHumanos.length > 0){
      let exportdata = this.filteredRecursosHumanos.map(e => {
        return {
          Fecha: e.creationDate.split("T")[0],
          Nombre: e.nombre,
          Apellido: e.apellido,
          "Nro. Legajo": e.nroLegajo,
          CUIL: e.cuil,
          Domicilio: e.direccion,
          Teléfono: e.telefono,
          Email: e.email,
          "Fecha de Nacimiento": e.fechaNacimiento.toString().split("T")[0],
          Multiservicio: e.multiservicio? "Sí" : "No"
        }
      })
      this.excelService.exportAsExcelFile(exportdata, 'Recursos Humanos', this.formGroup);
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
