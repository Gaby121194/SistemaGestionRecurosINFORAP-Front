import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadosEnum } from 'src/app/core/enums/estados.enum';
import { RecursoRenovable, RecursoRenovableFilter } from 'src/app/core/models/recursosrenovables';
import { TipoRecursoRenovable } from 'src/app/core/models/tipoRecursoRenovable';
import { ExcelService } from 'src/app/core/services/excel.service';
import { RecursosRenovablesService } from 'src/app/core/services/recursosRenovables.service';
import { TiporecursorenovableService } from 'src/app/core/services/tiporecursorenovable.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { RecursosrenovablesFormComponent } from 'src/app/views/recursosrenovables/recursosrenovables-form/recursosrenovables-form.component';
import { TipoRecursosRenovablesFormComponent } from 'src/app/views/recursosrenovables/tipoRecursosRenovables/tipo-recursos-renovables-form/tipo-recursos-renovables-form.component';


@Component({
  selector: 'app-recursosrenovables-list',
  templateUrl: './recursosrenovables-list.component.html',
  styleUrls: ['./recursosrenovables-list.component.scss']
})
export class RecursosRenovablesListComponent implements OnInit {

  recursosRenovables: RecursoRenovable[];
  filteredRecursosRenovables: RecursoRenovable[];

  formGroup: FormGroup;
  submitted = false;

  page: number = 1;
  modalRef: any;
  activeStep: number;
  steps: { text: string; active: boolean; }[];
  filteredTiposRecursosRenovables: TipoRecursoRenovable[];
  tiposRecursosRenovables: TipoRecursoRenovable[];
  submittedRecursos: boolean;
  formGroupRecursos: FormGroup;
  formGroupTipos: FormGroup;
  submittedTipos: boolean;

  pageRecurso = 1;
  pageTipo = 1;

  estadosRecursos: {}[];
  hasErrors: boolean;

  constructor(private basicService: RecursosRenovablesService,
    private tipoRecursoRenovableService: TiporecursorenovableService,
    private modalService: MatDialog,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dateValidator: DateValidator,
    private dialogService: DialogService,

    private excelService: ExcelService,
    private confirmService: DialogService) { }

  async ngOnInit(): Promise<void> {
    this.listEstadosRecursos();
    this.initSteps();
    this.goToStep(0);
    this.cd.detectChanges();



  }

  initSteps() {
    this.activeStep = 0;
    this.steps = [
      { text: 'Recursos renovables', active: true },
      { text: 'Tipos', active: false },
    ]
  }

  goToStep(index: number) {
    if (index == 0) {
      this.createFormRecursos();
      this.basicService.list().subscribe(s => {
        this.recursosRenovables = this.filteredRecursosRenovables = s
      });
    }

    else if (index == 1) {
      this.createFormTipos();
      this.tipoRecursoRenovableService.list().subscribe(s => {
        this.tiposRecursosRenovables = this.filteredTiposRecursosRenovables = s
      })
    }

    this.steps.forEach(s => s.active = false);
    this.steps[index].active = true;
    this.activeStep = index;


  }

  onSearchRecursos() {
    this.submittedRecursos = true;
    if (this.formGroupRecursos.valid) {
      var filter = this.formGroupRecursos.value as RecursoRenovableFilter;
      this.basicService.listBy(filter).subscribe(
        s => {
          this.filteredRecursosRenovables = s;
        }
      );
    }
  }

  listEstadosRecursos(){
    this.estadosRecursos = [
      { key: EstadosEnum["Disponible"], value: "Disponible"},
      { key: EstadosEnum["Asignado"], value: "Asignado"}
    ]
  }

  onSearchTipos() {
    this.submittedTipos = true;
    if (this.formGroupTipos.valid) {
      this.tipoRecursoRenovableService.listBy(this.formGroupTipos.value).subscribe(
        s => {
          this.filteredTiposRecursosRenovables = s;
        }
      );
    }
  }

  createFormRecursos() {
    this.formGroupRecursos = this.fb.group({
      name: '',
      idEstado: null,
      creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")],
      creationDateTo: [null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }

  createFormTipos() {
    this.formGroupTipos = this.fb.group({
      name: '',
      creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")],
      creationDateTo: [null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }


  clearRecursos() {
    this.createFormRecursos();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.goToStep(0);

  }

  clearTipos() {
    this.createFormTipos();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.goToStep(1);

  }

  createRecurso() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = '60%';
    matDialogConfig.height = '70%';

    this.modalRef = this.modalService.open(RecursosrenovablesFormComponent, matDialogConfig);


    this.modalRef.afterClosed().subscribe(s => {
      this.basicService.listBy(this.formGroupRecursos.value).subscribe(
        s => {
          this.filteredRecursosRenovables = s;
        }
      )
    })
  }


  editRecurso(id) {
    const dialogRef = this.modalService.open(RecursosrenovablesFormComponent, {
      disableClose: false,
      autoFocus: true,
      width: '60%',
      height: '70%'

    });
    dialogRef.componentInstance.id = id;


    dialogRef.afterClosed().subscribe(s => this.basicService.listBy(this.formGroupRecursos.value)
      .subscribe(s => this.recursosRenovables = this.filteredRecursosRenovables = s))
  }

  deleteRecurso(id) {
    this.dialogService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if (res) {
        this.basicService.delete(id).subscribe(s => {
          this.openSnackBar("El recurso renovable fue eliminado correctamente")
          this.basicService.listBy(this.formGroupRecursos.value).subscribe(
            s => { this.filteredRecursosRenovables = s; }
          )
        }, err => {
          this.openSnackBar("No es posible eliminar un recurso asignado a " + err.error.mensaje)
        }
        );
      }
    });
  }

  createTipo() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;

    this.modalService.open(TipoRecursosRenovablesFormComponent, matDialogConfig).afterClosed().subscribe(r => {
      this.tipoRecursoRenovableService.list().subscribe(s => this.tiposRecursosRenovables = this.filteredTiposRecursosRenovables = s);
    })
  }

  editTipo(id) {

    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;


    const modalRef = this.modalService.open(TipoRecursosRenovablesFormComponent, matDialogConfig);
    modalRef.componentInstance.id = id;

    modalRef.afterClosed().subscribe(s => this.tipoRecursoRenovableService.list()
      .subscribe(s => this.tiposRecursosRenovables = this.filteredTiposRecursosRenovables = s))

  }
  deleteTipo(id) {

    this.confirmService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if (res) {
        this.tipoRecursoRenovableService.delete(id).subscribe(s => {
          this.openSnackBar("El Tipo fue eliminado correctamente")
          this.tipoRecursoRenovableService.list().subscribe(s => this.tiposRecursosRenovables = this.filteredTiposRecursosRenovables = s);
        },
          () => this.openSnackBar("No se puede eliminar un Tipo en uso"));
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }

  exportToExcelRecursos() {
    let exportdata = this.filteredRecursosRenovables.map(e => {
      return {
        "Fecha de creación": e.idRecursoNavigation.creationDate.split("T")[0],
        "Fecha de vecimiento": e.fechaVencimiento.split("T")[0],
        Descripción: e.idRecursoNavigation.descripcion,
        Estado: e.idRecursoNavigation.idEstadoNavigation.descripcion,
        Tipo: e.idTipoRecursoRenovableNavigation.descripcion,
        Ubicación: e.idRecursoNavigation.idUbicacionNavigation.referencia
      }
    })
    this.excelService.exportAsExcelFile(exportdata, 'Recursos Renovables', this.formGroupRecursos);
  }


  exportToExcelTipos() {
    if (this.filteredTiposRecursosRenovables.length > 0){
      let exportdata = this.filteredTiposRecursosRenovables.map(e => {
        return {
          Fecha: e.creationDate,
          Marca: e.descripcion,
        }
      })
      this.excelService.exportAsExcelFile(exportdata, 'TiposRecursosMateriales', this.formGroupTipos);
   
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }
 }
}
