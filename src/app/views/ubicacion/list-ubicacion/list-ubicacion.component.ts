import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Ubicacion } from 'src/app/core/models/ubicacion';
import { UbicacionesService } from 'src/app/core/services/ubicaciones.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormUbicacionComponent } from '../form-ubicacion/form-ubicacion.component';


import { FormGroup, FormBuilder} from '@angular/forms';

import { DateValidator } from 'src/app/core/validators/date.validator';
import { ExcelService } from 'src/app/core/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { getEnabledCategories } from 'trace_events';


@Component({
  selector: 'app-list-ubicacion',
  templateUrl: './list-ubicacion.component.html'
})
export class ListUbicacionComponent implements OnInit {

  ubicaciones: Ubicacion[];
  filteredUbicaciones: Ubicacion[];

  empresas: {}[];
  isSuperUser: boolean;
  formGroup: FormGroup;

  submitted = false;

  page = 1;

  hasErrors : boolean;

  constructor(
    private basicService: UbicacionesService,
    private modalService : MatDialog,
    private dialogService: DialogService,
    private cd : ChangeDetectorRef,
    private fb : FormBuilder,
    private snackBar : MatSnackBar,
    private dateValidator : DateValidator,
    private excelService: ExcelService,
  ){ }

  ngOnInit() {
    this.createForm();
    this.listUbicaciones();
    this.cd.detectChanges();
  }
 
  listUbicaciones(){
    this.basicService.list().subscribe(s=> this.ubicaciones = this.filteredUbicaciones = s)
  }



  createForm(){

      this.formGroup = this.fb.group({
        name: '',
        creationDateFrom:[null, this.dateValidator.mustBeMinor("creationDateTo")],
        creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
      })
    
  }

  onSearch(){
    this.submitted = true;
    if (this.formGroup.valid) {
      this.basicService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredUbicaciones = s;
        }
      );
    }
  }
  

  clear(){

    this.createForm();

    this.listUbicaciones();

    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;

  }


  create(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;

    const modalRef = this.modalService.open(FormUbicacionComponent, matDialogConfig);


    modalRef.afterClosed().subscribe(() => this.onSearch())
  }

  edit(id){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;

    const modalRef = this.modalService.open(FormUbicacionComponent, matDialogConfig);
    modalRef.componentInstance.id = id;

    modalRef.afterClosed().subscribe(() => this.onSearch())
  }

  delete(id){
    this.dialogService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      
      if(res){
        this.basicService.delete(id).subscribe(s=> {
          this.openSnackBar("La Ubicacion fue eliminada correctamente")
          this.basicService.listBy(this.formGroup.value).subscribe(
            s => {
              this.filteredUbicaciones = s;
            })
        }, 
        () => {
          debugger
          return this.openSnackBar("No se puede eliminar una ubicación en uso")
        }
        );
      }
    });
  }
  
  exportToExcel(){
    if (this.filteredUbicaciones.length > 0){
      let exportdata = this.filteredUbicaciones.map(e => {
        return {
          Fecha: e.creationDate.split("T")[0],
          Provincia: e.descripcionProvincia,
          Departamento: e.departamento,
          Localidad: e.localidad,
          Calle: e.calle,
          Número: e.numero? e.numero : "S/N",
          Referencia: e.referencia,
          }
      })
      this.excelService.exportAsExcelFile(exportdata,'Ubicaciones', this.formGroup);
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
