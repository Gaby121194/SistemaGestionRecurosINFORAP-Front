import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncionalidadService } from 'src/app/core/services/funcionalidad.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { FuncionalidadValidator } from 'src/app/core/validators/funcionalidad.validator';
import { RolValidator } from 'src/app/core/validators/rol.validator';

@Component({
  selector: 'app-form-funcionalidad',
  templateUrl: './form-funcionalidad.component.html'
})
export class FormFuncionalidadComponent implements OnInit {

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
    private basicService: FuncionalidadService,
    private permisoService: PermisosService,
    private validador: FuncionalidadValidator,
    private snackBar: MatSnackBar
  ) { }


  async ngOnInit() {    
    if (this.id > 0) {
      this.metodo = true;
      this.title = "Editar funcionalidad";
      this.subtitle = "Modifique los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      let view = await  this.basicService.getBy(this.id).toPromise();
      this.formGroup = this.fb.group(
        {
          id: [this.id],
          display: [view.display, [Validators.required, Validators.minLength(3), Validators.maxLength(50)], this.validador.validField.bind(this)],
          url: [view.url, [Validators.required, Validators.minLength(3), Validators.maxLength(255)], this.validador.validField.bind(this)],
          // display: [view.display, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          // url: [view.url, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
          active: true,
          icon: view.icon,
          show: [view.show,[Validators.required]],                  
        }
      );
    }
    else {
      this.title = "Crear funcionalidad";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group(
        {
          id: [0],
          display: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)], this.validador.validateFields()],
          url: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(255)], this.validador.validateFields()],
          active: true,
          icon: [""],
          show: [false,[Validators.required]],     
        }
      )
    }
  }
  save(){
    if (this.metodo){
      if(this.formGroup.valid){
        this.basicService.update(this.id,this.formGroup.value).subscribe(s=>{
          this.openSnackBar("La funcionalidad ha sido modificada correctamente");
        })
        
      } 
    }
    else {
      if (this.formGroup.valid){
        this.basicService.create(this.formGroup.value).subscribe(s=>{
          this.openSnackBar("La funcionalidad sido creada correctamente");
        })
      }
    }
  }


  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });}

}
