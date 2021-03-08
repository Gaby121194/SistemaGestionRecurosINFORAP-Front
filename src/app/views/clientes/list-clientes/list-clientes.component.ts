import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/shared/dialog.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { Cliente } from 'src/app/core/models/cliente';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { FormClientesComponent } from '../form-clientes/form-clientes.component';
import { ExcelService } from 'src/app/core/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-clientes',
  templateUrl: './list-clientes.component.html'
})
export class ListClientesComponent implements OnInit {

  clientes: Cliente[];
  filteredclientes: Cliente[];

  empresas: {}[];
  isSuperUser: boolean;
  formGroup: FormGroup;

  idEmpresaActual: number = null;
  submitted = false;

  page = 1;

  hasErrors : boolean;

  constructor(
    private basicService: ClienteService,
    private modalService : MatDialog,
    private empresasService : EmpresasService,
    private dialogService: DialogService,
    private authService : AuthenticationService,
    private cd : ChangeDetectorRef,
    private fb : FormBuilder,
    private dateValidator : DateValidator,
    private excelService : ExcelService,
    private snackBar : MatSnackBar
  ){ }

  async ngOnInit(): Promise<void> {
    this.isSuperUser = this.authService.getAuthenticationToken().isSuperUser;

    if(this.isSuperUser){
      this.empresas = await this.GetEmpresas();  
    }
   
    this.createForm();
    this.listclientes();
    this.cd.detectChanges();
  }
 
  listclientes(){
    this.basicService.list().subscribe(s=> this.clientes = this.filteredclientes = s)
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

  async createForm(){
    this.formGroup = this.fb.group({
      name: '',
      creationDateFrom:[null, this.dateValidator.mustBeMinor('creationDateTo')],
      creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }

  onSearch(){
    this.submitted = true;
    if (this.formGroup.valid) {
      this.basicService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredclientes = s;
        }
      );
    }
  }
  

  clear(){
    this.createForm();

    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.listclientes();

  }


  create(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    const modalRef = this.modalService.open(FormClientesComponent, matDialogConfig);


    modalRef.afterClosed().subscribe(s=> this.basicService.list()
    .subscribe(s => this.clientes = this.filteredclientes = s))
  }

  edit(id){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;


    const modalRef = this.modalService.open(FormClientesComponent, matDialogConfig);
    modalRef.componentInstance.id = id;

    modalRef.afterClosed().subscribe(s=> this.basicService.list()
    .subscribe(s => this.clientes = this.filteredclientes = s))
  }

  delete(id){
    this.dialogService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if(res){
        this.basicService.delete(id).subscribe(s=> {
          this.openSnackBar("El cliente fue eliminado correctamente")
          this.basicService.list().subscribe(
            s => {  this.clientes = this.filteredclientes = s }
            );
        },
          () => {
            return this.openSnackBar("No se puede eliminar un cliente con un servicio activo");
          });
      }
    });
  }

  exportToExcel(){
    if (this.filteredclientes.length > 0){
      let exportdata = this.filteredclientes.map(e => {
        return {
          Fecha: e.creationDate.split("T")[0],
          "Razon Social": e.razonSocial,
          CUIL: e.cuil,
          Email: e.email,
          Teléfono: e.telefono,
          }
      })
      this.excelService.exportAsExcelFile(exportdata,'Clientes', this.formGroup);
    } 
    else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }

}
