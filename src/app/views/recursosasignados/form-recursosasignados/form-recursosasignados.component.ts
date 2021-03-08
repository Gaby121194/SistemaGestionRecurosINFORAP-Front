import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recurso } from 'src/app/core/models/recurso';
import { RecursoAsignado } from 'src/app/core/models/recursosasignados';
import { ServicioRecurso } from 'src/app/core/models/servicio-recurso';
import { RecursoService } from 'src/app/core/services/recurso.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-form-recursosasignados',
  templateUrl: './form-recursosasignados.component.html'
})
export class FormRecursosasignadosComponent implements OnInit {

  index: number;
  title: string;
  recursos : any[]
  idRecurso1: number;
  labelName: string;

  formGroup: FormGroup;
  submitted: boolean = false;

  constructor(
    private basicService : RecursoService,
    private fb : FormBuilder,
    private snackBar : MatSnackBar,
    private dialogRef : MatDialogRef<FormRecursosasignadosComponent>
  ) { }

  ngOnInit(): void {
    this.fillRecursos();
    this.createForm();
  }

  createForm(){
    this.formGroup = this.fb.group({
      idRecurso1 : this.idRecurso1,
      idRecurso2 : ['', Validators.required],
      idUbicacion: ''
    })
  }

  async  fillRecursos(){
    if (this.index == 1){
      this.labelName = "Recurso Material"
      this.recursos = await this.listMaterialResources();
    } else if(this.index == 2){
      this.labelName = "Recurso Renovable"
      this.recursos = await this.listRenovableResources();
      console.log(this.recursos)
    }
  }

  async listRenovableResources() {
    let resources = await this.basicService.listRRRRFromRecurso(this.idRecurso1).toPromise();
    return resources.map(s => {
      return {
        key: `${s.idRecurso}-${s.idRecursoNavigation.idUbicacionNavigation.id}`,
        value: `${s.idRecursoNavigation.descripcion}` + " - " + `${s.idTipoRecursoRenovableNavigation?.descripcion}` + " - " + `${s.idRecursoNavigation.idUbicacionNavigation.descripcionProvincia}, ${s.idRecursoNavigation.idUbicacionNavigation.referencia}`
      }
    });
  }

  async listMaterialResources() {
    let resources = await this.basicService.listRRMMFromRecurso(this.idRecurso1).toPromise();
    return resources.map(s => {
      return {
        key: s.stockeable == true ? `${s.idRecurso}-${s.idUbicacion}` : s.idRecurso,
        value: ` ${s.marca} ${s.modelo}`+ " - " + `${s.idTipoRecursoMaterialNavigation?.descripcion}` + " " + (s.stockeable == true ? s.idRecursoNavigation.descripcion : "")
      }
    });
  }

  async save(){
    if(this.formGroup.valid){

      if (this.index == 1){ // si es un recurso material

        let recursoAsignado = new RecursoAsignado();
        recursoAsignado.idRecurso1 = this.idRecurso1;

        let ids = String(this.formGroup.get('idRecurso2').value).split("-");
        recursoAsignado.idRecurso2 = Number(ids[0])
        if (ids.length > 1){
          recursoAsignado.idUbicacion = Number(ids[1]);
          recursoAsignado.isStock = true;
        } else {
          recursoAsignado.isStock = false;
        }
        this.basicService.insertMaterialAsignado(recursoAsignado).subscribe(
          () => this.openSnackBar("El recurso fue asignado correctamente")
        ),
          () => this.openSnackBar("El recurso no cuenta con stock disponible")

      }
      else if(this.index == 2){ // si es un recurso renovable
        let recursoAsignado = new RecursoAsignado();
        recursoAsignado.idRecurso1 = this.idRecurso1;
        
        let ids = String(this.formGroup.get('idRecurso2').value).split("-");
        recursoAsignado.idRecurso2 = Number(ids[0]);
        recursoAsignado.idUbicacion = Number(ids[1]);
        
        this.basicService.insertRenovableAsignado(recursoAsignado).subscribe(
          () => this.openSnackBar("El recurso fue asignado correctamente")
        )
      }
    }
  }



  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }
}
