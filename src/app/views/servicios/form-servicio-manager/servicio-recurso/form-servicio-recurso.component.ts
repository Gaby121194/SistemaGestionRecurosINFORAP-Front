import { Component, Inject, OnInit } from '@angular/core';
import { ServicioRecurso } from 'src/app/core/models/servicio-recurso';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecursoService } from 'src/app/core/services/recurso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoRecursoEnum } from 'src/app/core/enums/tipo-recurso.enum';
import { Recurso } from 'src/app/core/models/recurso';

@Component({
  selector: 'app-form-servicio-recurso',
  templateUrl: './form-servicio-recurso.component.html'
})
export class FormServicioRecursoComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<FormServicioRecursoComponent>,
    private fb: FormBuilder,
    private recursoService: RecursoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar) { }
  typeResource: any[];
  humanResources: any[];
  materialResources: any[];
  activeForm: number;
  formGroup: FormGroup;
  submitted: boolean = false;
  idServicio: any;
  async ngOnInit() {
    this.idServicio = this.data.idServicio;
    this.getTypeResource();
    await this.getResources();
  }

  getTypeResource() {
    this.typeResource = [
      { id: 1, descripcion: "Recurso humano", active: true },
      { id: 2, descripcion: "Recurso material", active: false }
    ]
    this.activeForm = 0;
    this.formGroup = this.fb.group({
      idRecurso: ['', Validators.required],
      idTipoRecurso: [this.typeResource[0].id, Validators.required],
      idUbicacion: null
    });
  }
  showFormTypeResource(i: number) {
    if (i === this.activeForm) return;
    this.typeResource[this.activeForm].active = false;
    this.typeResource[i].active = true;
    this.activeForm = i;
    let abstractControl: AbstractControl = this.formGroup.controls['idTipoRecurso'];
    if (abstractControl) {
      abstractControl.setValue(this.typeResource[i].id);
    }
  }
  async getResources() {
    this.humanResources = await this.listHumanResources();
    this.materialResources = await this.listMaterialResources();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async listHumanResources() {
    let rrhh = await this.recursoService.listRecursosHumanosAvailable(this.idServicio).toPromise();
    return rrhh.map(s => {
      return {
        key: s.idRecurso,
        value: `${s.nombre}, ${s.apellido} - ${s.cuil}`
      }
    })
  }
  async listMaterialResources() {
    let rrMat = await this.recursoService.listRecursosMaterialesAvailable(this.idServicio).toPromise();
    return rrMat.map(s => {
      return {
        key: s.stockeable == true ? `${s.idRecurso}-${s.idUbicacion}` : s.idRecurso,
        value: `${s.marca} ${s.modelo}` + (s.stockeable == true ? s.idRecursoNavigation.descripcion : "")
      }
    });
  }
  async addResource() {
    if (this.formGroup.valid) {
      if (this.activeForm == 0) {
        await this.addRrhh(this.formGroup.value);
        this.dialogRef.close(true);
      } else {
        await this.addRrMat(this.formGroup.value);
        this.dialogRef.close(true);
      }
    }
  }
  async addRrhh(formData) {
    let servicioRecurso = new ServicioRecurso();
    servicioRecurso.idServicio = this.idServicio;
    servicioRecurso.idRecurso = formData.idRecurso;
    servicioRecurso.recurso = new Recurso();
    servicioRecurso.recurso.idTipoRecurso = TipoRecursoEnum["Recurso Humano"];
    servicioRecurso.recurso.id = formData.idRecurso;
    await this.recursoService.insertServicioRecurso(this.idServicio, servicioRecurso).toPromise();
    this.openSnackBar("Recurso asignado correctamente");
  }
  async addRrMat(formData) {
    let servicioRecurso = new ServicioRecurso();
    servicioRecurso.idServicio = this.idServicio;
    let ids = String(formData.idRecurso).split("-");
    servicioRecurso.idRecurso = Number(ids[0]);
    servicioRecurso.recurso = new Recurso();
    servicioRecurso.recurso.idTipoRecurso = TipoRecursoEnum["Recurso Material"];
    servicioRecurso.recurso.id = Number(ids[0]);
    if (ids.length > 1) {
      servicioRecurso.idUbicacion = Number(ids[1]);
      servicioRecurso.isStock = true;
    } else {
      servicioRecurso.isStock = false;
    }
    await this.recursoService.insertServicioRecurso(this.idServicio, servicioRecurso).toPromise();
    this.openSnackBar("Recurso asignado correctamente");
  }
  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });

  }

}
