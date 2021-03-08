import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UbicacionesService } from 'src/app/core/services/ubicaciones.service';
import { ProvinciasService } from 'src/app/core/services/provincias.service';
import { Provincia } from 'src/app/core/models/Provincia';
import { UbicacionValidator } from 'src/app/core/validators/ubicacion.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-form-ubicacion',
  templateUrl: './form-ubicacion.component.html'
})
export class FormUbicacionComponent implements OnInit {

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

  idProvincia: string
  
  provincias: Provincia[];
  selprovincias: {}[];


  constructor(private fb: FormBuilder, 
    private basicService: UbicacionesService,
    private provinciaService: ProvinciasService,
    private ubicacionValidator : UbicacionValidator,
    private cd : ChangeDetectorRef,
    private snackBar : MatSnackBar
  ) { }

  async ngOnInit() {
    this.selprovincias = await this.listProvincias();
    this.createForm();
    this.cd.detectChanges();
  }

  async listProvincias() {
    return new Promise<{}[]>(resolve => {
      this.provinciaService.list().subscribe(s => {
        resolve(s.map(k => {
          return {
            key: k.idProvincia,
            value: k.nombre
          }
        }));
        return;
      });
    });
  }
   
  createForm(){
    if(this.id>0) {
      this.metodo = true;
      this.title = "Editar Ubicación";
      this.subtitle = "Modifique los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      this.basicService.getBy(this.id).subscribe( s=> {
        this.formGroup = this.fb.group({
          id: this.id,
          calle: [s.calle, Validators.required],
          departamento: [s.departamento, Validators.required],
          localidad: [s.localidad, Validators.required],
          numero: [s.numero, Validators.pattern("[0-9]*")],
          referencia: [s.referencia,[Validators.required] ,this.ubicacionValidator.validateFields(this.id.toString())],
          idProvincia: [s.idProvincia, Validators.required],
          idEmpresa : s.idEmpresa,
        })
      })
    } else {
      this.title = "Crear Ubicación";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.formGroup = this.fb.group(
        {
          id: '',
          calle: ['', Validators.required],
          departamento: ['', Validators.required],
          localidad: ['', Validators.required],
          numero: ['', Validators.pattern("[0-9]*")],
          referencia: ['', [Validators.required],this.ubicacionValidator.validField.bind(this)],
          idProvincia: '',
          idEmpresa: ''
        }
      )
    }
  }
  save(){

    if (this.metodo && this.formGroup.valid){

      this.basicService.update(this.id,this.formGroup.value).subscribe(
        () => this.openSnackBar("La ubicación fue editada correctamente")
      )
    }
    else if (this.formGroup.valid){
      this.basicService.create(this.formGroup.value).subscribe(
        () => this.openSnackBar("La ubicación fue creada correctamente")
      )
    } else {
      this.openSnackBar("No se pudo realizar la solicitud")
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }
  
}