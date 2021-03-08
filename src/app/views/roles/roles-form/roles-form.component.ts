import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RolesService } from 'src/app/core/services/roles.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { Permiso } from 'src/app/core/models/permiso';
import { RolValidator } from 'src/app/core/validators/rol.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html'
})
export class RolesFormComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean = false;
  id: number;
  metodo: boolean = false;
  title: string;
  subtitle: string;
  icon: string;
  button: string;
  selPermisos: {}[];
 
  
  constructor(private fb: FormBuilder,
    private basicService: RolesService,
    private permisoService: PermisosService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private validador: RolValidator,
    private snackBar: MatSnackBar

  ) { }


  async ngOnInit() {
    await this.listPermisos();
    
    if (this.id > 0) {
      this.metodo = true;
      this.title = "Editar Rol";
      this.subtitle = "Modifique los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      this.basicService.getBy(this.id).subscribe(s => {
        this.formGroup = this.fb.group(
          {
            id: [s.id],
            nombre: [s.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(20)], this.validador.validateFields(s.id.toString())],
            active: true,
            descripcion: [s.descripcion,[Validators.required, Validators.minLength(3)]],
            idEmpresa: s.idEmpresa ,
            permisos : [[s.permisos]]           
          }
        );

        const control =  <FormArray>this.formGroup.get('permisos');
        var value = s.permisos;
        if (control && value) {
          control.setValue(value);   
        }

      });
    }
    else {
      this.title = "Crear Rol";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group(
        {
          id: [''],
          nombre: ['',[Validators.required, Validators.maxLength(15), Validators.minLength(3)], this.validador.validField.bind(this)],
          active: false,
          descripcion: ['', [Validators.required, Validators.minLength(3)]],
          idEmpresa: '' ,
          permisos : [[]]
        }
      )
    }
  }
  save(){
    if (this.metodo){
      if(this.formGroup.valid){
        this.basicService.update(this.id,this.formGroup.value).subscribe(s=>{
          this.openSnackBar("El rol ha sido modificado correctamente");
        })
        
      } 
    }
    else {
      if (this.formGroup.valid){
        this.basicService.create(this.formGroup.value).subscribe(s=>{
          this.openSnackBar("El rol ha sido creado correctamente");
        })
      }
    }
  }

  onPermisosChange(values: []) {
    const control =  <FormArray>this.formGroup.get('permisos');
    if (control && values) {
     control.setValue(values);   
    }
  }

  async listPermisos() {
    return new Promise<boolean>((resolve) => {
      this.permisoService.list().subscribe(p => {
        this.selPermisos = p.map(k => {
          return {
            key: k.id,
            value: k.descripcionPermiso
          }
        })
        resolve(true);
        return;
      });
    });
  }
  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });}

}