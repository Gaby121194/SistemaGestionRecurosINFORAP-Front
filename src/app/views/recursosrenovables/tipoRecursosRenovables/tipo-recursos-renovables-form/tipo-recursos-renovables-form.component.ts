import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/core/services/shared.service';
import { TiporecursorenovableService } from 'src/app/core/services/tiporecursorenovable.service';
import { TipoRecursoRenovableValidator } from 'src/app/core/validators/tiporecursorenovable.validator';

@Component({
  selector: 'app-tipo-recursos-renovables-form',
  templateUrl: './tipo-recursos-renovables-form.component.html',
  styleUrls: []
})
export class TipoRecursosRenovablesFormComponent implements OnInit {

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
    private basicService: TiporecursorenovableService,
    private basicValidator : TipoRecursoRenovableValidator,
    private sharedService : SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar : MatSnackBar,
    private dialogRef : MatDialogRef<TipoRecursosRenovablesFormComponent>,
  ) { }

  ngOnInit(): void {


    if (this.id > 0){
      this.metodo = true;
      this.title = "Editar Tipo de Recurso Renovable";
      this.subtitle = "Modifique el datos correspondiente:";
      this.button = "Modificar";
      this.icon = "edit"
 
      this.basicService.getBy(this.id).subscribe(s=>{
        this.formGroup = this.fb.group({
          id: this.id,
          descripcion: [s.descripcion, [Validators.required, Validators.pattern('^[a-zA-Z0-9](.*)'), Validators.minLength(3), Validators.max(50) ], this.basicValidator.validateFields(this.id.toString())],          
        });
      });
    }
    else {
      this.title = "Crear Tipo de Recurso Renovable";
      this.subtitle = "Complete el siguiente dato:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group({
        id: '',
        descripcion: ['', [Validators.required,  Validators.minLength(3), Validators.max(50),  Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validField.bind(this)],
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


  openSnackBarWithAction(message: string, action : string) {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
    });
    snackBarOpened.onAction().subscribe(()=> {
       this.dialogRef.close(true);
    })
  }
}
