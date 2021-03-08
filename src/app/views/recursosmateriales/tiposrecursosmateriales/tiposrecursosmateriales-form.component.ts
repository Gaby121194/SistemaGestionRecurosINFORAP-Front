import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiporecursosmaterialesService } from "src/app/core/services/tiporecursosmateriales.service";
import { TipoRecursoMaterialValidator } from 'src/app/core/validators/tiporecursomaterial.validator';

@Component({
  selector: 'app-tiposrecursosmateriales-form',
  templateUrl: './tiposrecursosmateriales-form.component.html'
})
export class TiposrecursosmaterialesFormComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean = false;
  id: number;
  metodo: boolean = false;
  title: string;
  subtitle: string;
  button: string;
  icon: string;
  
  constructor(
    private fb: FormBuilder, 
    private basicService: TiporecursosmaterialesService,
    private basicValidator : TipoRecursoMaterialValidator,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.id > 0){
      this.metodo = true;
      this.title = "Editar Tipo de Recurso";
      this.subtitle = "Modifique el datos correspondiente:";
      this.button = "Modificar";
      this.icon = "edit"
 
      this.basicService.getBy(this.id).subscribe(s=>{
        this.formGroup = this.fb.group({
          id: this.id,
          descripcion: [s.descripcion, [Validators.required, Validators.minLength(3), Validators.max(50), Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validateFields(this.id.toString())],          
        });
      });
    }
    else {
      this.title = "Crear Tipo de Recurso";
      this.subtitle = "Complete el siguiente dato:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group({
        id: '',
        descripcion: ['', [Validators.required, Validators.minLength(3), Validators.max(50), Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validField.bind(this)],
      })
    }
  }

  save(){

    if (this.metodo){
      if(this.formGroup.valid){
        this.basicService.update(this.id,this.formGroup.value).subscribe(
          () => this.openSnackBar("El Tipo fue editado correctamente")
        )
      } 
    }
    else {
      if (this.formGroup.valid){
        this.basicService.create(this.formGroup.value).subscribe(
          () => this.openSnackBar("El Tipo fue creado correctamente")
        )
      }
    }
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
      }
    );
  }


}
