import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RecursoMaterial, RecursoMaterialFilter } from 'src/app/core/models/recursosmateriales';
import { RecursosmaterialesService } from "src/app/core/services/recursosmateriales.service";
import { DialogService } from 'src/app/shared/dialog.service';
import { TiporecursosmaterialesService } from 'src/app/core/services/tiporecursosmateriales.service';
import { TipoRecursoMaterial } from 'src/app/core/models/tiporecursomaterial';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TiposrecursosmaterialesFormComponent } from '../tiposrecursosmateriales/tiposrecursosmateriales-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateValidator } from 'src/app/core/validators/date.validator';

import { ExcelService } from 'src/app/core/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormManagerRecursosmaterialesComponent } from '../form-manager-recursosmateriales/form-manager-recursosmateriales.component';
import { ListRecursosasignadosComponent } from '../../recursosasignados/list-recursosasignados/list-recursosasignados.component';
import { EstadosEnum } from 'src/app/core/enums/estados.enum';

@Component({
  selector: 'app-recursosmateriales-list',
  templateUrl: './recursosmateriales-list.component.html'
})
export class RecursosmaterialesListComponent implements OnInit {
  
  recursosMateriales: RecursoMaterial[];
  filteredRecursosMateriales: RecursoMaterial[];

  tiposRecursosMateriales : TipoRecursoMaterial[];
  filteredTiposRecursosMateriales : TipoRecursoMaterial[];

  steps: any[];
  activeStep: number;

  submittedRecursos = false;
  submittedTipos = false;

  formGroupRecursos : FormGroup;
  formGroupTipos : FormGroup;
  
  pageRecurso = 1;
  pageTipo = 1;

  modalRef;

  hasErrors: boolean;

  estadosRecursos: {}[];

  constructor(private basicService : RecursosmaterialesService, 
    private tiposRecursosMaterialesService : TiporecursosmaterialesService,
    private dateValidator : DateValidator,
    private fb : FormBuilder,
    private cd : ChangeDetectorRef,
    private modalService : MatDialog,
    private excelService : ExcelService,
    private snackBar: MatSnackBar,
    private dialogService : DialogService,
    private confirmService: DialogService) { }

  ngOnInit(): void {
    this.listEstados();
    this.initSteps();
    this.goToStep(0);
    this.cd.detectChanges();

  }

  

  initSteps() {
    this.activeStep = 0;
    this.steps = [
      { text: 'Recursos materiales', active: true },
      { text: 'Tipos', active: false },
    ]
  }

  goToStep(index: number) {
    if(index == 0){
      this.createFormRecursos();
      this.basicService.list().subscribe(s =>{
        this.recursosMateriales = this.filteredRecursosMateriales = s
      });
    }
    
    else if(index == 1) {
      this.createFormTipos();
      this.tiposRecursosMaterialesService.list().subscribe(s => {
        this.tiposRecursosMateriales = this.filteredTiposRecursosMateriales = s
      })
    }

    this.steps.forEach(s => s.active = false);
    this.steps[index].active = true;
    this.activeStep = index;


  }

  listEstados(){
    this.estadosRecursos = [
      { key: EstadosEnum["Disponible"], value: "Disponible"},
      { key: EstadosEnum["Asignado"], value: "Asignado"},
      { key: EstadosEnum["Fuera_de_Servicio"], value: "Fuera de Servicio"}
    ]
  }

  createFormRecursos(){
    this.formGroupRecursos = this.fb.group({
      name: '',
      idEstado: null,
      creationDateFrom:[null, this.dateValidator.mustBeMinor("creationDateTo") ],
      creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }

  createFormTipos(){
    this.formGroupTipos = this.fb.group({
      name: '',
      creationDateFrom:[null, this.dateValidator.mustBeMinor("creationDateTo") ],
      creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }

  onSearchRecursos(){
    this.submittedRecursos = true;
    if (this.formGroupRecursos.valid) {
      var filter = this.formGroupRecursos.value as RecursoMaterialFilter
      this.basicService.listBy(filter).subscribe(
        s => {
          this.filteredRecursosMateriales = s;
        }
      );
    }
  }

  onSearchTipos(){
    this.submittedTipos = true;
    if (this.formGroupTipos.valid) {
      this.tiposRecursosMaterialesService.listBy(this.formGroupTipos.value).subscribe(
        s => {
          this.filteredTiposRecursosMateriales = s;
          console.log(this.filteredRecursosMateriales)
        }
      );
    }
  }

  clearRecursos(){
    this.createFormRecursos();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.goToStep(0);

  }

  clearTipos(){
    this.createFormTipos();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.goToStep(1);

  }



  iniciarFueraServicio(id){
    this.dialogService.openConfirmDialog("¿Quiere marcar al recurso como fuera de servicio momentáneamente?").afterClosed().subscribe(res => {
      if(res){
        this.basicService.StartoutOfService(id).subscribe(s=> {
          this.basicService.listBy(this.formGroupRecursos.value).subscribe(
            s => { 
              this.filteredRecursosMateriales = s;
              this.openSnackBar("El recurso esta fuera de servicio")
             }
          )
        }, () => this.openSnackBar("No es posible marcar como fuera de servicio un recurso asignado")
        );
      }
    });
  }

  terminarFueraServicio(id){
    this.dialogService.openConfirmDialog("¿Quiere marcar al recurso como disponible?").afterClosed().subscribe(res => {
      if(res){
        this.basicService.EndoutOfService(id).subscribe(s=> {
          this.basicService.listBy(this.formGroupRecursos.value).subscribe(
            s => { 
              this.filteredRecursosMateriales = s;
              this.openSnackBar("El recurso esta disponible nuevamente")
             }
          )
        }, () => this.openSnackBar("No fue posible habilitar el recurso")
        );
      }
    });
  }

  createRecurso(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = '70%';
    matDialogConfig.height = '90%';

    this.modalRef = this.modalService.open(FormManagerRecursosmaterialesComponent, matDialogConfig);


    this.modalRef.afterClosed().subscribe(s=>  {
      this.basicService.listBy(this.formGroupRecursos.value).subscribe(
        s => { 
          this.filteredRecursosMateriales = s;
        }
      )
    })
  }

  editRecurso(id){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = '70%';
    matDialogConfig.height = '90%';
    matDialogConfig.data = { id : id}

    this.modalRef = this.modalService.open(FormManagerRecursosmaterialesComponent, matDialogConfig);

    this.modalRef.afterClosed().subscribe(s=>  {
      this.basicService.listBy(this.formGroupRecursos.value).subscribe(
        s => {
          this.filteredRecursosMateriales = s;
        }
      )
    })
  }

  showAsignRecursos(item: RecursoMaterial){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = '80%';
    matDialogConfig.height = '90%';


    this.modalRef = this.modalService.open(ListRecursosasignadosComponent, matDialogConfig);
    this.modalRef.componentInstance.idRecurso = item.idRecurso;
    this.modalRef.componentInstance.id = item.id;
    this.modalRef.componentInstance.booleano = item.stockeable;
    this.modalRef.componentInstance.nameFather = item.marca + " " + item.modelo;

    this.modalRef.afterClosed().subscribe(s=>  {
      this.basicService.listBy(this.formGroupRecursos.value).subscribe(
        s => {
          this.filteredRecursosMateriales = s;
        }
      )
    })

  }
  
  deleteRecurso(id) {
    this.dialogService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if(res){
        this.basicService.delete(id).subscribe(s=> {
          this.openSnackBar("El recurso material fue eliminado correctamente")
          this.basicService.listBy(this.formGroupRecursos.value).subscribe(
            s => { this.filteredRecursosMateriales = s; }
          )
        }, () => this.openSnackBar("No es posible eliminar un recurso asignado")
        );
      }
    });
  }
  


  createTipo(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
  
    this.modalService.open(TiposrecursosmaterialesFormComponent, matDialogConfig).afterClosed().subscribe(r => {
      this.tiposRecursosMaterialesService.list().subscribe(s=> this.tiposRecursosMateriales = this.filteredTiposRecursosMateriales = s);   
    })
  }
  
  editTipo(id){
 
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    

    const modalRef = this.modalService.open(TiposrecursosmaterialesFormComponent, matDialogConfig);
    modalRef.componentInstance.id = id;

    modalRef.afterClosed().subscribe(s=> this.tiposRecursosMaterialesService.list()
    .subscribe(s => this.tiposRecursosMateriales = this.filteredTiposRecursosMateriales = s))

  }
  
  deleteTipo(id) {
     
    this.confirmService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if(res){
        this.tiposRecursosMaterialesService.delete(id).subscribe(s=> {
          this.openSnackBar("El Tipo fue eliminado correctamente")
          this.tiposRecursosMaterialesService.list().subscribe(s => this.tiposRecursosMateriales = this.filteredTiposRecursosMateriales = s);
        },
        () => this.openSnackBar("No se puede eliminar un Tipo en uso"));
      }
    });
  }


  exportToExcelRecursos(){
    if(this.filteredRecursosMateriales.length > 0){
      let exportdata = this.filteredRecursosMateriales.map(e => {
        return {
          Fecha: e.idRecursoNavigation.creationDate.split("T")[0],
          Marca: e.marca,
          Modelo: e.modelo,
          Estado : e.idRecursoNavigation.idEstadoNavigation.descripcion,
          Tipo : e.idTipoRecursoMaterialNavigation.descripcion,
          Stockeable : e.stockeable? "Sí" : "No",
          Multiservicio : e.multiservicio? "Sí" : "No"
          }
      })
      this.excelService.exportAsExcelFile(exportdata,'Recursos Materiales', this.formGroupRecursos);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }

  
  exportToExcelTipos(){
    if (this.filteredTiposRecursosMateriales.length > 0){
      let exportdata = this.filteredTiposRecursosMateriales.map(e => {
        return {
          Fecha: e.creationDate.split("T")[0],
          Descripción: e.descripcion,
          }
      })
      this.excelService.exportAsExcelFile(exportdata,'Tipos de Recursos Materiales', this.formGroupTipos);
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
