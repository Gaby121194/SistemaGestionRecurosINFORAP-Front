import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/core/models/usuario';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  constructor(private usuariosService: UsuariosService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private confirmService : DialogService,
    private empresasService: EmpresasService,
    private cd: ChangeDetectorRef,
    private dateValidator: DateValidator,
    private router: Router,
    private snackBar: MatSnackBar,
    private excelService: ExcelService,) { }
  users: Usuario[]
  filteredUsers: Usuario[];
  isSuperUser: boolean;
  formGroup: FormGroup;
  empresas: {}[];
  submitted = false;
  page: number = 1;
  hasErrors : boolean;
  async ngOnInit() {
    this.isSuperUser = this.authenticationService.getAuthenticationToken().isSuperUser;
    if (this.isSuperUser == true) {
      this.empresas = await this.GetEmpresas();
    }
    this.loadForm();
    this.listUsers();
    this.cd.detectChanges();
  }
  
  listUsers() {
    this.usuariosService.list().subscribe(s => {
      this.users = this.filteredUsers = s;
    });
  }
  loadForm() {
    if (this.isSuperUser == true) {

      this.formGroup = this.fb.group({
        name: '',
        idEmpresa: '',
        creationDateFrom: [, this.dateValidator.mustBeMinor("creationDateTo") ], 
        creationDateTo: [, this.dateValidator.mustBeMajor("creationDateFrom")]
      });
    } else {
      this.formGroup = this.fb.group({
        name: '',
        creationDateFrom: [, this.dateValidator.mustBeMinor("creationDateTo") ], 
        creationDateTo: [, this.dateValidator.mustBeMajor("creationDateFrom")]
      })
    }
  }

  resetPassword(email){
    
    this.confirmService.openConfirmDialog("¿Está seguro que desea restablecer la contraseña?").afterClosed().subscribe(res => {
      if(res){
        this.usuariosService.recoveryPassword(email).subscribe(()=> this.openSnackBar("La contraseña fue restablecida correctamente"))
      }
    });
   
  }

  openSnackBar(message: string, action: string =null) {
    let snackBarOpened = this.snackBar.open(message, action, {
       duration: 5000,
       //panelClass : ["bg-white","text-dark"]
     });
    
   }
  applyFilter(filterValue: string) {
    if (filterValue == "") {
      this.filteredUsers = this.users
      return;
    }
    filterValue = filterValue.toLowerCase();
    this.filteredUsers = this.users.filter(
      u => {
        return u.nombre.toLowerCase().includes(filterValue) || u.apellido.toLowerCase().includes(filterValue)
          || u.email.toLowerCase().includes(filterValue)
          || u.id.toString().includes(filterValue)
      });
  }
  edit(id) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      disableClose : false,
      autoFocus : true,
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(async result => {
      await this.listUsers();
    });
  }
  onCreate() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      disableClose : false,
      autoFocus : true,
      data: { }
    });
    dialogRef.afterClosed().subscribe(async result => {
      await this.listUsers();
    });
  }
  delete(id) {

    this.confirmService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if(res){
        this.usuariosService.delete(id).subscribe(()=> {
          this.openSnackBar("El Usuario fue eliminado correctamente")
          this.listUsers();
        })
      }
    });
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
  onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.usuariosService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredUsers = s;
        });
    }
  }
  clear() {
    this.loadForm();
    this.listUsers();

    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }
  exportToExcel(){
    if (this.filteredUsers.length > 0){
      let exportdata = this.filteredUsers.map(e => {
        return {
          Fecha: e.creationDate.toString().split("T")[0],
          Apellido : e.apellido,
          Nombre: e.nombre,
          Email: e.email,
          Rol: e.rol.descripcion,
          Empresa: e.empresa.razonSocial,
          }
      })
      this.excelService.exportAsExcelFile(exportdata,'Usuarios', this.formGroup);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }

  
}
