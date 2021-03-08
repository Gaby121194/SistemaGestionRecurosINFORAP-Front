import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecursoAsignado } from 'src/app/core/models/recursosasignados';
import { RecursoServicio } from 'src/app/core/models/recursoservicio';
import { ExcelService } from 'src/app/core/services/excel.service';
import { RecursoService } from 'src/app/core/services/recurso.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormRecursosasignadosComponent } from '../form-recursosasignados/form-recursosasignados.component';
RecursoServicio
@Component({
  selector: 'app-list-recursosasignados',
  templateUrl: './list-recursosasignados.component.html'
})
export class ListRecursosasignadosComponent implements OnInit {

  submitted: boolean = false;

  id: number;
  idRecurso: number;
  metodo: boolean = false;
  title: string;
  subtitle: string;
  button: string;
  icon: string;

  FormSearch: FormGroup;

  serviciosAsignados: RecursoServicio[];
  filteredServiciosAsignados: RecursoServicio[];

  filteredRecursosAsignados: RecursoAsignado[];


  steps: any[];
  activeStep: number;

  page = 1;

  booleano : boolean;
  hasErrors: boolean;

  nameFather : string; //nombre y apellido si es humano, marca y modelo si es material

  constructor(
    private fb: FormBuilder,
    private dialogService : DialogService,
    private recursoService: RecursoService,
    private dateValidator: DateValidator,
    private modalService : MatDialog,
    private basicService : RecursoService,
    private excelService : ExcelService,
    private snackBar : MatSnackBar,
    private dialogRef: MatDialogRef<ListRecursosasignadosComponent>,
    private cd : ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initSteps();
    this.goToStep(0);
  }

  initSteps() {
    this.steps = [
      { text: 'Servicios', active: true },
      { text: 'Recursos Materiales', active: false },
      { text: 'Recursos Renovables', active: false },
    ]
  }

  async goToStep(index: number) {
    this.submitted= false;
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.createFormSearch();
    this.page = 1;
    this.filteredRecursosAsignados = undefined;
    this.filteredServiciosAsignados= undefined;

    switch (index) {
      case 0:
        this.activeStep = 0;
        this.title = "Servicios Asignados";
        this.subtitle = this.nameFather;
        this.filteredServiciosAsignados = await this.recursoService.listServiciosAsignados(this.idRecurso,this.FormSearch.value).toPromise();
        break;
      case 1:
        this.activeStep = 1
        this.title = "Recursos Materiales Asignados";
        this.subtitle = this.nameFather;
        this.filteredRecursosAsignados = await this.recursoService.listMaterialesAsignados(this.idRecurso, this.FormSearch.value).toPromise();  
        break;
      case 2:
        this.activeStep = 2    
        this.title = "Recursos Renovables Asignados";
        this.subtitle = this.nameFather;
        this.filteredRecursosAsignados = await this.recursoService.listRenovablesAsignados(this.idRecurso, this.FormSearch.value).toPromise();  
        break;
      default:
        break;
    }


    this.steps.forEach(s => s.active = false);
    this.steps[index].active = true;
    this.activeStep = index;

  }

  createFormSearch(){
    this.FormSearch = this.fb.group({
      name: '',
      creationDateFrom: [, this.dateValidator.mustBeMinor("creationDateTo")],
      creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }

  async onSearch(){
    this.submitted = true;
    if(this.FormSearch.valid){

      if(this.activeStep == 0){
          this.filteredServiciosAsignados= await this.basicService.listServiciosAsignados(this.id, this.FormSearch.value).toPromise();
      }
      
      else if(this.activeStep == 1){
        this.filteredRecursosAsignados = await this.basicService.listMaterialesAsignados(this.idRecurso, this.FormSearch.value).toPromise();
      }

      else if(this.activeStep == 2){
        this.filteredRecursosAsignados = await this.basicService.listRenovablesAsignados(this.idRecurso, this.FormSearch.value).toPromise();
      }
    }

   
  }

  clearSearch(index : number){

    this.goToStep(index);
  }

  createAsignacion(){

    if (this.activeStep == 1){
      const matDialogConfig = new MatDialogConfig();
      matDialogConfig.disableClose = false;
      matDialogConfig.autoFocus = false;
  
      const modalRef = this.modalService.open(FormRecursosasignadosComponent, matDialogConfig);
      modalRef.componentInstance.index = this.activeStep;
      modalRef.componentInstance.idRecurso1 = this.idRecurso;
      modalRef.componentInstance.title = "Asignar Recurso Material"
  
      modalRef.afterClosed().subscribe(() => this.goToStep(this.activeStep));
    }else if(this.activeStep == 2){
      const matDialogConfig = new MatDialogConfig();
      matDialogConfig.disableClose = false;
      matDialogConfig.autoFocus = false;
  
      const modalRef = this.modalService.open(FormRecursosasignadosComponent, matDialogConfig);
      modalRef.componentInstance.index = this.activeStep;
      modalRef.componentInstance.idRecurso1 = this.idRecurso;
      modalRef.componentInstance.title = "Asignar Recurso Renovable"
  
      modalRef.afterClosed().subscribe(() => this.goToStep(this.activeStep));
    }

  }

  desasignar(id){
    this.dialogService.openConfirmDialog("¿Está seguro que desea desasignar el recurso?").afterClosed().subscribe(res => {
      if(res){
        this.recursoService.deleteRecursoAsignado(id).subscribe(
          () => {
            this.openSnackBar("El recurso fue desasignado correctamente")
            this.goToStep(this.activeStep)
          }
        );
      }
    });
  }
  desasignarservicio(id) {
    this.dialogService.openConfirmDialog("¿Está seguro que desea desasignar al recurso del servicio?").afterClosed().subscribe(res => {
      if (res) {
        this.recursoService.removeServicioRecurso(id).subscribe(
          () => {
            this.openSnackBar("El recurso fue desasignado correctamente")
            this.goToStep(0)
        });
      }
    });
  }

  exportToExcel(){
    if(this.activeStep == 0){
      if (this.filteredServiciosAsignados.length > 0){
        let exportdata = this.filteredServiciosAsignados.map(e=>{
          return{
            "Fecha Asignado": e.fechaAsignado.split("T")[0],
            Nombre: e.servicio.nombre,
            "Nro. contrato": e.servicio.nroContrato,
            "Fecha de Inicio": e.servicio.fechaInicio.split("T")[0],
            "Fecha de Fin": e.servicio.fechaFin.split("T")[0],
            Cliente: e.cliente,
            "En curso": e.servicio.idMotivoBajaServicio? 'No':'Sí',
          }
        })
        this.excelService.exportAsExcelFile(exportdata,`Servicios de ${this.nameFather}`, this.FormSearch);
      } else{
        this.openSnackBar("No es posible exportar un listado vacío")
      }
    
    }

    else if(this.activeStep == 1){
      if (this.filteredRecursosAsignados.length > 0){
        let exportdata = this.filteredRecursosAsignados.map(e => {
          return {
            "Fecha Asignado": e.fechaAsignado.split("T")[0],
            Marca: e.recursoMaterial.marca,
            Modelo: e.recursoMaterial.modelo,
            Ubicación: e.referenciaUbicacion != null ? e.referenciaUbicacion : "No tiene",
            "Tipo de Recurso": e.recursoMaterial.idTipoRecursoMaterialNavigation.descripcion,
            Stockeable: e.recursoMaterial.stockeable? 'Sí ' : 'No',
            Multiservicio: e.recursoMaterial.multiservicio? 'Sí ': 'No'
            }
        })
        this.excelService.exportAsExcelFile(exportdata,`Recursos Materiales de ${this.nameFather}`, this.FormSearch);
     
      } else{
        this.openSnackBar("No es posible exportar un listado vacío")
      }
 }

    else if(this.activeStep == 2){
      if (this.filteredRecursosAsignados.length > 0){
        let exportdata = this.filteredRecursosAsignados.map(e => {
          return {
            "Fecha Asignado": e.fechaAsignado.split("T")[0],
            "Descripción": e.recursoRenovable?.idRecursoNavigation?.descripcion,
            Ubicación: e.recursoRenovable?.idRecursoNavigation?.idUbicacionNavigation?.referencia,
            "Fecha de Vencimiento": e.recursoRenovable?.fechaVencimiento.split("T")[0],
            "Tipo de Recurso": e.recursoRenovable?.idTipoRecursoRenovableNavigation.descripcion,
            }
        })
        this.excelService.exportAsExcelFile(exportdata,`Recursos Renovables de ${this.nameFather}`, this.FormSearch);
      
      } else{
        this.openSnackBar("No es posible exportar un listado vacío")
      }
}
  }

  close(){
    this.dialogRef.close(true);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }
}
