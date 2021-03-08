import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ClienteValidator } from 'src/app/core/validators/cliente.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-clientes',
  templateUrl: './form-clientes.component.html'
})
export class FormClientesComponent implements OnInit {

  id: number;
  descripcion: string;
  title: string;
  subtitle: string;
  button: string;
  icon: string;
  formGroup: FormGroup;
  submitted: boolean = false;
  metodo: boolean = false;
  idEmpresa: number;


  constructor(private fb: FormBuilder, 
    private basicService: ClienteService,
    private clienteValidator : ClienteValidator,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit(): Promise<void> {

    if(this.id>0) {
      this.metodo = true;
      this.title = "Editar Cliente";
      this.subtitle = "Modifique los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      let cliente = await this.basicService.getBy(this.id).toPromise();
      this.formGroup = this.fb.group
      (
        {
          id: this.id,
          razonSocial: [cliente.razonSocial, [Validators.required], this.clienteValidator.validateFields(this.id.toString())],
          email: [cliente.email, Validators.email],
          cuil: [cliente.cuil, [Validators.required, Validators.pattern("(20|23|27|30|33)([0-9]{9})")], this.clienteValidator.validateFields(this.id.toString())],
          telefono: [cliente.telefono, Validators.pattern("[0-9]*")],
          idEmpresa : cliente.idEmpresa,

        }
      );
    }
    else {
      this.title = "Crear Cliente";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group(
        {
          id: '',
          razonSocial: ['', [Validators.required], this.clienteValidator.validField.bind(this)],
          email: ['', Validators.email],
          cuil: ['', [Validators.required, Validators.pattern("(20|23|27|30|33)([0-9]{9})")],this.clienteValidator.validField.bind(this)],
          telefono: ['', Validators.pattern("[0-9]*")],
          idEmpresa : '',
        }
      )
    }
  }

  save(){

    if (this.metodo && this.formGroup.valid){
      this.basicService.update(this.id,this.formGroup.value).subscribe(
        () => this.openSnackBar("El Cliente fue editado correctamente")
      )
    }
    else if (this.formGroup.valid){
      this.basicService.create(this.formGroup.value).subscribe(
        () => this.openSnackBar("El Cliente fue creado correctamente")
      )
    } else {
      this.dialogService.openAlertDialog("No se pudo realizar la solicitud")
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }

}
