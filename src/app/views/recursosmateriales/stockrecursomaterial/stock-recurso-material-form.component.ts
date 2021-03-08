import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockrecursosmaterialesService } from 'src/app/core/services/stockrecursosmateriales.service';
import { UbicacionesService } from 'src/app/core/services/ubicaciones.service';
import { Ubicacion } from 'src/app/core/models/ubicacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stock-recurso-material-form',
  templateUrl: './stock-recurso-material-form.component.html'
})
export class StockRecursoMaterialFormComponent implements OnInit {

  id: number;
  idRecurso: number;
  descripcion: string;
  title: string;
  subtitle: string;
  button: string;
  icon: string;
  formGroup: FormGroup;
  submitted: boolean = false;
  metodo: boolean = false;
  idRecursoMaterial: number;

  ubicaciones: Ubicacion[];
  selUbicaciones: {}[]
  


  constructor(private fb: FormBuilder, 
    private basicService: StockrecursosmaterialesService,
    private ubicacionService : UbicacionesService,
    private snackBar : MatSnackBar,
    private dialogRef : MatDialogRef<StockRecursoMaterialFormComponent>,
  ) { }

  ngOnInit(): void {
    this.ubicacionService.listForStock(this.idRecursoMaterial).subscribe(r => {
      this.ubicaciones = r;
      this.selUbicaciones = r.map( k => {
        return {
          key: k.id,
          value: k.referencia
        }
      })
    })

    if(this.id > 0) {
      this.metodo = true;
      this.title = "Editar Stock";
      this.subtitle = "Modifica los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      this.basicService.getBy(this.id).subscribe( s=> {
        console.log(s.cantidadTotal - s.cantidadDisponible)
        this.formGroup = this.fb.group({
          id: this.id,
          idRecursoMaterial: [s.idRecursoMaterial],
          idUbicacion: [s.idUbicacion],
          cantidadTotal: [s.cantidadTotal, [Validators.required, Validators.min(s.cantidadTotal - s.cantidadDisponible), Validators.max(99999), Validators.pattern("[0-9]+")]],
          cantidadDisponible: [s.cantidadDisponible],
        })
      })
    } else {
      this.title = "Crear Stock";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group(
        {
          id: '',
          idRecursoMaterial: this.idRecursoMaterial,
          idUbicacion: [''],
          cantidadTotal: ['', [Validators.required, Validators.min(0), Validators.max(999999), Validators.pattern("[0-9]+")]],
        }
      )
    }
  }

  save(){
    if (this.formGroup.valid){
      if (this.metodo){
        this.basicService.update(this.id,this.formGroup.value).subscribe(
          () => this.openSnackBar("El Stock fue editado correctamente")
        );
      }
      else {
        this.basicService.create(this.formGroup.value).subscribe(
          () => this.openSnackBar("El Stock fue creado correctamente")
        ); 
      }
    } else {
      this.openSnackBar("No se pudo generar la solicitud")
    }
    
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }


}