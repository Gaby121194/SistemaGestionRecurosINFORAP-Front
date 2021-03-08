import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiciosService } from 'src/app/core/services/servicios.service';

@Component({
  selector: 'app-form-servicio-baja',
  templateUrl: './form-servicio-baja.component.html'
})
export class FormServicioBajaComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private servicioService: ServiciosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FormServicioBajaComponent>,) { }
  motivoBaja: {}[];
  formGroup: FormGroup;
  submitted = false;
  idServicio: any;
  title = "Dar de Baja";
  icon="delete";
  btn = "Dar de baja"
  async ngOnInit() {
    if (!this.data && !this.data.idServicio) {
      this.dialogRef.close(false);
    }
    this.idServicio = this.data.idServicio;
    await this.listMotivoBaja();
    this.loadFormGroup();

  }
  loadFormGroup() {
    this.formGroup = this.fb.group({
      idMotivoBajaServicio: ['', Validators.required],
      observaciones: ['', Validators.required],
    });
  }
  async listMotivoBaja() {
    let result = await this.servicioService.listMotivoBajaServicios().toPromise();
    this.motivoBaja = result.map(s => {
      return {
        key: s.id,
        value: s.descripcion
      }
    });
  }
  save() {
    this.submitted =true;
    if (this.formGroup.valid) {
      var formData = this.formGroup.value;
      this.servicioService.delete(this.idServicio, formData.idMotivoBajaServicio, formData.observaciones).subscribe(
        r => {
          this.openSnackBar("El servicio fue dado de baja corréctamente")
          this.dialogRef.close(true);
        },
        err => {
          this.openSnackBar("Ocurrió un error, intente mas tarde")
        }
      )
    }
  }

  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });
  }
  onNoClick(){this.dialogRef.close(false)}
}
