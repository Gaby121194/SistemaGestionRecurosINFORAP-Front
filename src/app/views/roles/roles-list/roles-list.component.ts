import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RolesService } from "src/app/core/services/roles.service";
import { Rol } from "src/app/core/models/rol";
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ExcelService } from 'src/app/core/services/excel.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html'
})
export class RolesListComponent implements OnInit {

  roles: Rol[]
  filteredRoles: Rol[];
  page: 1;


  empresas: {}[];
  isSuperUser: boolean;

  formGroup: FormGroup;
  submitted = false;

  hasErrors: boolean;
  constructor(private rolesService : RolesService,
    private authenticationService : AuthenticationService,
    private modalService : MatDialog,
    private empresasService: EmpresasService,
    private confirmService: DialogService,
    private dateValidator : DateValidator,
    private cd : ChangeDetectorRef,
    private snackBar : MatSnackBar,
    private fb : FormBuilder,
    private excelService: ExcelService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isSuperUser = this.authenticationService.getAuthenticationToken().isSuperUser;

    if(this.isSuperUser){
      this.empresas = await this.GetEmpresas(); 
    }
   
    this.createForm();
    this.listRoles();
    this.cd.detectChanges();
   
  }
 
  listRoles(){
    this.rolesService.list().subscribe(s=> this.roles = this.filteredRoles = s)
  }

  async GetEmpresas() {
    return new Promise<{}[]>(resolve => {
     this.empresasService.list().subscribe(s => {       
       resolve(s.map(e => {
         return {
           key: e.id,
           value: e.razonSocial
         }
       }));
       return;
     })
   })
 }

  onSearch(){
    this.submitted = true;
    if (this.formGroup.valid) {
      this.rolesService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredRoles = s;
        });
    }
  }

  clear(){
    this.listRoles()
    this.createForm();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }

  

  async createForm(){
    if(this.isSuperUser){
      this.formGroup = this.fb.group({
        name: '',
        idEmpresa: '',
        creationDateFrom:[null, this.dateValidator.mustBeMinor("creationDateTo")],
        creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
      });
    }
    else{
      //this.idEmpresaActual = this.authService.getAuthenticationToken().usuario.idEmpresa;
      this.formGroup = this.fb.group({
        name: '',
        creationDateFrom:[null, this.dateValidator.mustBeMinor("creationDateTo")],
        creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
      })
    }
  }


  create(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    // matDialogConfig.maxHeight = '60%';
    //matDialogConfig.maxWidth = '80%';
    // matDialogConfig.minHeight = '50%';
    // matDialogConfig.minWidth = '50%';
    // matDialogConfig.height = 
  
    const modalRef = this.modalService.open(RolesFormComponent, matDialogConfig);


    modalRef.afterClosed().subscribe(s=> this.rolesService.list()
    .subscribe(s => this.roles = this.filteredRoles = s))

  }

  edit(id) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    // matDialogConfig.maxHeight = '80%';
    // matDialogConfig.maxWidth = '80%';
    // matDialogConfig.minHeight = '50%';
    // matDialogConfig.minWidth = '50%';


    const modalRef = this.modalService.open(RolesFormComponent, matDialogConfig);
    modalRef.componentInstance.id = id;

    modalRef.afterClosed().subscribe(s=> this.rolesService.list()
    .subscribe(s => this.roles = this.filteredRoles = s))
  }

  delete(id) {
    this.confirmService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if(res){

        this.rolesService.delete(id).subscribe(s=> {
          this.openSnackBar("El Rol fue eliminado correctamente")
          this.rolesService.list().subscribe(s => this.roles = this.filteredRoles = s);
        });
      }
    });
  }
  
  exportToExcel(){
    if (this.filteredRoles.length > 0){
      let exportdata = this.filteredRoles.map(e => {
        return {
          Fecha: e.creationDate.split("T"),
          Nombre: e.nombre,
          Descripción: e.descripcion,
          }
      })
      this.excelService.exportAsExcelFile(exportdata,'Roles', this.formGroup);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }
    
  }
 
  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
     });
  }
}
