import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncionalidadService } from 'src/app/core/services/funcionalidad.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { PermisoValidator } from 'src/app/core/validators/permiso.validator';

@Component({
  selector: 'app-form-permisos',
  templateUrl: './form-permisos.component.html'
})
export class FormPermisosComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean = false;
  id: number;
  metodo: boolean = false;
  title: string;
  subtitle: string;
  icon: string;
  button: string;
  funcionalidad: {}[];


  constructor(private fb: FormBuilder,
    private basicService: PermisosService,
    private funcionalidadService: FuncionalidadService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private validador: PermisoValidator,
    private snackBar: MatSnackBar,
    private cd : ChangeDetectorRef

  ) { }


  async ngOnInit() {
    await this.listFuncionalidad();

    if (this.id > 0) {
      this.metodo = true;
      this.title = "Editar permiso";
      this.subtitle = "Modifique los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      this.basicService.getBy(this.id).subscribe(s => {
      
        this.formGroup = this.fb.group(
          {
            id: [s.id],
            nombrePermiso: [s.nombrePermiso, [Validators.required, Validators.minLength(3), Validators.maxLength(20)], this.validador.validField.bind(this)],
            active: true,
            descripcionPermiso: [s.descripcionPermiso, [Validators.required, Validators.minLength(3)]],
            controllersIds:  [[s.controllersIds]]  
          }         
        );
        let control = <FormArray>this.formGroup.get('controllersIds');
        let  values = s.controllersIds
        if (control && values) {         
          control.setValue(values);    
          console.log(control)    
        }
        
      });
    }
    else {
      this.title = "Crear permiso";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group(
        {
          id: [0],
          nombrePermiso: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(3)], this.validador.validField.bind(this)],
          active: true,
          descripcionPermiso: ['', [Validators.required, Validators.minLength(3)]],
          controllersIds: [[]]
        }
      )
    }
   }
  save() {
    if (this.metodo) {
      if (this.formGroup.valid) {
        this.basicService.update(this.id, this.formGroup.value).subscribe(s => {
          this.openSnackBar("El permiso ha sido modificado correctamente");
        })

      }
    }
    else {
      if (this.formGroup.valid) {
        this.basicService.create(this.formGroup.value).subscribe(s => {
          this.openSnackBar("El permiso ha sido creado correctamente");
        })
      }
    }
  }

  onFuncionalidadChange(values: []) {
    const control = <FormArray>this.formGroup.get('controllersIds');
    if (control && values) {
      control.setValue(values);
    }
  }

  async listFuncionalidad() {
    let func = await this.funcionalidadService.list().toPromise();
    this.funcionalidad = func.map(k => {
      return {
        key: k.id,
        value: k.display
      }
    })   
  }
  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });
  }

}
