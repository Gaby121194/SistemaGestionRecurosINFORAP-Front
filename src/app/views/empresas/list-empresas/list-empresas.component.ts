import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Empresa } from 'src/app/core/models/empresa';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { EmpresaFormComponent } from '../form-empresa/form-empresa.component';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { ExcelService } from 'src/app/core/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-empresas',
  templateUrl: './list-empresas.component.html',
  styleUrls: ['./list-empresas.component.scss']

})
export class ListEmpresasComponent implements OnInit {
  empresas: Empresa[]
  filteredEmpresas: Empresa[];
  
  multiEmpresas: {}[];

  isSuperUser : boolean;

  formGroup: FormGroup;
  submitted = false;

  page: number = 1;

  idEmpresaActual : number;

  hasErrors : boolean;

  estadosEmpresa : {}[];

  constructor(private empresasService : EmpresasService,
    private authenticationService : AuthenticationService,
    private modalService : MatDialog,
    private confirmService: DialogService,
    private dateValidator : DateValidator,
    private cd : ChangeDetectorRef,
    private dialogService : DialogService,
    private snackbar : MatSnackBar,
    private fb : FormBuilder,
    private excelService: ExcelService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.isSuperUser = this.authenticationService.getAuthenticationToken().isSuperUser;
    this.idEmpresaActual = this.authenticationService.getAuthenticationToken().usuario.idEmpresa;

    if (this.isSuperUser){
      this.multiEmpresas = await this.GetEmpresas();
    }

    this.loadForm();
    this.listEmpresas();
    this.listEstados();
    this.cd.detectChanges();
  }
 
  listEmpresas(){
    this.empresasService.list().subscribe(s=> this.empresas = this.filteredEmpresas = s)
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
      this.empresasService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredEmpresas = s;
        });
    }
  }

  clear(){
    this.listEmpresas()
    this.loadForm();
    
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }

  loadForm() {
    if (this.isSuperUser == true) {
      this.formGroup = this.fb.group({
        name: '',
        active: null,
        idEmpresa: '',
        creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")], 
        creationDateTo: [null, this.dateValidator.mustBeMajor("creationDateFrom")]
      });
    } else {
      this.formGroup = this.fb.group({
        name: '',
        active: null,
        creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")], 
        creationDateTo: [null, this.dateValidator.mustBeMajor("creationDateFrom")]
      })
    }
  }

  create(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = "50%";
    matDialogConfig.height = "90%";

    const modalRef = this.modalService.open(EmpresaFormComponent, matDialogConfig);


    modalRef.afterClosed().subscribe(s=> this.empresasService.list()
    .subscribe(s => this.empresas = this.filteredEmpresas = s))

  }

  edit(id) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = "50%";
    matDialogConfig.height = "90%";

    const modalRef = this.modalService.open(EmpresaFormComponent, matDialogConfig);
    modalRef.componentInstance.id = id;

    modalRef.afterClosed().subscribe(s=> this.empresasService.list()
    .subscribe(s => this.empresas = this.filteredEmpresas = s))
  }

  delete(id) {
    this.confirmService.openConfirmDialog("¿Está seguro que desea deshabilitar la empresa y todos sus usuarios?").afterClosed().subscribe(res => {
      if(res){
        this.empresasService.delete(id).subscribe(s=> {
          this.openSnackBar("La empresa fue deshabilitada correctamente")
          this.empresasService.list().subscribe(s => this.empresas = this.filteredEmpresas = s);
        });
      }
    });
  }

  listEstados(){
    this.estadosEmpresa = [
      {key: true, value: "Habilitado"},
      {key: false, value: "Deshabilitado"}
    ]
  }

  activate(id){
    this.confirmService.openConfirmDialog("¿Está seguro que desea habilitar la empresa y todos sus usuarios?").afterClosed().subscribe(res => {
      if(res){
        this.openSnackBar("La Empresa fue habilitada correctamente")
        this.empresasService.activate(id).subscribe(s=> this.empresasService.list().subscribe(s => this.empresas = this.filteredEmpresas = s)
        );
      }
    });
  }
  exportToExcel(){
    if (this.filteredEmpresas.length > 0){
    let exportdata = this.filteredEmpresas.map(e => {
      return {
        Fecha: e.creationDate.split("T")[0],
        "Razón social" : e.razonSocial,
        Domicilio: e.domicilio,
        CUIT: e.cuit,
        Teléfono : e.telefono,
        "Correo Contacto": e.correoContacto,
        "Usuario Contacto": e.usuarioContacto
        }
    })
    this.excelService.exportAsExcelFile(exportdata,'Empresas', this.formGroup);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }

  openSnackBar(message: string) {
    this.snackbar.open(message, "", {
       duration: 5000,
     });
  }
}
