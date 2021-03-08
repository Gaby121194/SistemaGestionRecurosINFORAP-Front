import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserValidator } from 'src/app/core/validators/user.validator';
import { Usuario } from 'src/app/core/models/usuario';
import { CdkAccordion } from '@angular/cdk/accordion';
import { RecursosHumanosService } from 'src/app/core/services/recursos-humanos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermisoEnum } from 'src/app/core/enums/permiso.enum';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private userService: UsuariosService,
    private rolService: RolesService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private empresasService: EmpresasService,
    private userValidator: UserValidator,
    private snackBar: MatSnackBar,
    private cd : ChangeDetectorRef,
    private recursosHumanosService : RecursosHumanosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  id: any;
  formGroup: FormGroup;
  submitted: boolean = false;
  selRoles: {}[];
  empresas: {}[];
  btnSubmit = "";
  icon = "";
  title = "";
  subTitle = "";
  user: Usuario;
  isSuperUser = false;
  isCurrentUser = false;
  canEditRol = false;
  humanResources: {}[];
  idRecursoHumano : any;
  letras = "^([a-zA-ZñÑÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ\\s])+$";
  async ngOnInit() {
    this.id = this.data.id;
    let currUser = this.authenticationService.getAuthenticationToken().usuario;
    let permisions = this.authenticationService.getAuthenticationToken().permisos;
    this.isSuperUser = this.authenticationService.getAuthenticationToken().isSuperUser;
    if (this.isSuperUser) {
      this.empresas = await this.GetEmpresas();
    }
    if(permisions.some(s=>s.nombrePermiso.toUpperCase() == PermisoEnum.ADMIN || s.nombrePermiso.toUpperCase() == PermisoEnum.MANAGER)){
      this.canEditRol = true;
    }

    if (this.id) {
      this.btnSubmit = "Editar";
      this.icon = "edit";
      this.title = "Editar usuario";
      this.subTitle = "Modifica los datos de tu usuario";
      this.isCurrentUser = this.id === currUser.id;
      this.user = await this.LoadFormGroup(this.id);
      if(this.isSuperUser!=true){
        this.humanResources = await this.listHumanResources();  
      }
      this.selRoles = await this.GetRolesByIdEmpresa(this.user.idEmpresa); 
      this.cd.detectChanges();
    } else {
      this.btnSubmit = "Crear"
      this.icon = "add";
      this.subTitle = "Ingrese los datos del usuario";
      this.title = "Crear usuario"
      this.selRoles = await this.GetRolesByIdEmpresa(currUser.idEmpresa)
      this.humanResources = await this.listHumanResources();
      this.formGroup = this.fb.group(
        {
          id: 0,
          nombre: ['', [Validators.pattern(this.letras), Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
          apellido: ['',  [Validators.pattern(this.letras),Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
          email: ['', [Validators.required, Validators.email], this.userValidator.validUsername.bind(this)],
          idEmpresa: [currUser.idEmpresa, Validators.required],
          idRol: ['', Validators.required],
          idRecursoHumano: '',
          active: true
        });
    }
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
  async GetRolesByIdEmpresa(idEmpresa) {
    return new Promise<{}[]>(resolve => {
      this.rolService.listByEmpresaId(idEmpresa).subscribe(s => {
        resolve(s.map(k => {
          return {
            key: k.id,
            value: k.nombre
          }
        }));
        return;
      });
    });
  }
  async LoadFormGroup(id) {
    return new Promise<Usuario>(resolve => {
      this.userService.getBy(id).subscribe(s => {
        if(this.isSuperUser!= true){
          this.idRecursoHumano = s.idRecursoHumano;
        }
        if (this.isCurrentUser) {
          this.formGroup = this.fb.group(
            {
              id: this.id,
              nombre: [s.nombre, [Validators.pattern(this.letras),Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
              apellido: [s.apellido, [Validators.pattern(this.letras),Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
              email: [s.email, [Validators.required, Validators.email]],
              idEmpresa: [s.idEmpresa, Validators.required],
              password: [''],
              rePassword: ['', this.userValidator.matchValues('password')],
              idRol: [s.idRol, Validators.required],
              idRecursoHumano: s.idRecursoHumano,
              active: s.active
            });
        } else {
          this.formGroup = this.fb.group(
            {
              id: this.id,
              nombre: [s.nombre,[Validators.pattern(this.letras), Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
              apellido: [s.apellido, [Validators.pattern(this.letras), Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
              email: [s.email, [Validators.required, Validators.email]],
              idEmpresa: [s.idEmpresa, Validators.required],
              idRol: [s.idRol, Validators.required],
              idRecursoHumano: s.idRecursoHumano,
              active: s.active
            });
        }
        resolve(s);
        return;
      });
    });
  }
 async onEmpresaChange(event){
    this.selRoles = await this.GetRolesByIdEmpresa(event);
    var control = this.formGroup.controls["idRol"];
    if(control?.value){
      control.setValue('');
    }
    this.cd.detectChanges();
   }

   async listHumanResources(){
     if(this.idRecursoHumano){
       let res = await this.recursosHumanosService.listRecursosHumanosWithOutUser(this.idRecursoHumano).toPromise();
       return res.map(s=> {return {
         key : s.id,
         value : `${s.apellido}, ${s.nombre} - ${s.cuil}`
       }});
     }else{
      let res = await this.recursosHumanosService.listRecursosHumanosWithOutUser().toPromise();
      return res.map(s=> {return {
        key : s.id,
        value : `${s.apellido}, ${s.nombre} - ${s.cuil}`
      }});
     }
   }
  save() {
    this.submitted = true;
    if (this.formGroup.valid) {
      if (this.id) {
        this.update()
      } else {
        this.create();
      }
    }
  }

  create() {
    this.userService.insert(this.formGroup.value).subscribe(s => {
      this.openSnackBar("El usuario fue creado correctamente")
      this.dialogRef.close(true);
    });
  }
  
  update() {
    this.userService.update(this.id, this.formGroup.value).subscribe(s => {
      this.openSnackBar("El usuario fue editado correctamente")
      this.dialogRef.close(true);
    });
  }

  onRolChange(value) {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }
}
