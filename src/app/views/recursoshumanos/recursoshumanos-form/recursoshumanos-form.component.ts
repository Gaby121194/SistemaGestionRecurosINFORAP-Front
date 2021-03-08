import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/shared/dialog.service';
import { RecursosHumanosService } from 'src/app/core/services/recursos-humanos.service';
import { RecursoHumanoValidator } from 'src/app/core/validators/recursohumano.validator';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { DateHelper } from 'src/app/core/helpers/date.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { RecursoService } from 'src/app/core/services/recurso.service';



@Component({
  selector: 'app-recursoshumanos-form',
  templateUrl: './recursoshumanos-form.component.html',
  styleUrls: ['./recursoshumanos-form.component.scss']
})
export class RecursosHumanosFormComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  button: string;
  update: boolean = false;
  multiservicio: boolean;

  uploadPercent: Observable<number>;
  imagen: string;
  finalizando = false;
  completado: boolean = false;
  porcentaje: any;
  
  letras = "^([a-zA-ZñÑÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ\\s])+$";

  serviciosAsignados : boolean;


  constructor(private fb: FormBuilder,
    private basicService: RecursosHumanosService,
    private recursoService: RecursoService,
    private recursoHumanoValidator: RecursoHumanoValidator,
    private dialogService: DialogService,
    private authService: AuthenticationService,
    private datePipe: DatePipe,
    private dateHelper: DateHelper,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    if (this.id > 0) {
      this.update = true;
      this.title = "Editar Recurso Humano";
      this.subtitle = "Modifique los datos correspondientes:";
      this.button = "Modificar";
      this.icon = "edit"
      this.basicService.getBy(this.id).subscribe(async s => {
        this.formGroup = this.fb.group({
          id: this.id,
          idRecurso: s.idRecurso,
          nombre: [s.nombre, [Validators.pattern(this.letras), Validators.required]],
          apellido: [s.apellido, [Validators.pattern(this.letras), Validators.required]],
          cuil: [s.cuil, [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("(20|23|27|30|33)([0-9]{9})")], this.recursoHumanoValidator.validateFields(this.id.toString())],
          nroLegajo: [s.nroLegajo, [Validators.pattern("[0-9]*"), Validators.required], this.recursoHumanoValidator.validateFields(this.id.toString())],
          direccion: [s.direccion, Validators.required],
          telefono: [s.telefono,[Validators.required, Validators.pattern("[0-9]*")]],
          email: [s.email, [Validators.required, Validators.email], this.recursoHumanoValidator.validateFields(this.id.toString())],
          fechaNacimiento: [this.datePipe.transform(s.fechaNacimiento, 'dd-MM-yyyy'), [Validators.required]],
          multiservicio: s.multiservicio,
          idEmpresa: s.idEmpresa,
          imagen: s.imagen
        })
        this.multiservicio = s.multiservicio;
        this.imagen = s.imagen;

        if ((await this.recursoService.listServiciosAsignados(s.idRecurso, this.fb.group({name: '', creationDateFrom: null, creationDateTo: null}).value).toPromise()).length > 1){
          this.serviciosAsignados = true;
        }
      })
    } else {
      this.title = "Crear Recurso Humano";
      this.subtitle = "Complete los siguientes datos:";
      this.button = "Crear";
      this.icon = "add";
      this.imagen = "./assets/images/profile.jpg";
      this.formGroup = this.fb.group(
        {
          id: '',
          idRecurso: '',
          nombre: ['', [Validators.pattern(this.letras), Validators.required]],
          apellido: ['', [Validators.pattern(this.letras), Validators.required]],
          cuil: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("(20|23|27|30|33)([0-9]{9})")], this.recursoHumanoValidator.validField.bind(this)],
          nroLegajo: ['', [Validators.required, Validators.pattern("[0-9]*")], this.recursoHumanoValidator.validField.bind(this)],
          direccion: ['', [Validators.required]],
          telefono: ['', [Validators.pattern("[0-9]*"),Validators.required]],
          email: ['', [Validators.required, Validators.email], this.recursoHumanoValidator.validField.bind(this)],
          fechaNacimiento: ['', [Validators.required]],
          multiservicio: '',
          idEmpresa: this.authService.getAuthenticationToken().usuario.idEmpresa,
          imagen:'',

        }
      )
    }
  }


  save() {

    if (this.formGroup.valid) {
      var date = this.dateHelper.ParseDateToString(this.formGroup.get('fechaNacimiento').value)
      this.formGroup.patchValue({
        fechaNacimiento: date,
        multiservicio: this.multiservicio
      })
      if (this.imagen.length > 0) {
        this.formGroup.patchValue({
          imagen: this.imagen
        })
      }

      if (this.update) {
        this.basicService.update(this.id, this.formGroup.value).subscribe(
          () => this.openSnackBar("El recurso humano fue editado correctamente")
        ),
          () => this.openSnackBar("El recurso no se pudo editar")

      } else {
        this.basicService.create(this.formGroup.value).subscribe(
          () => this.openSnackBar("El recurso humano fue creado correctamente")
        ),
          () => this.openSnackBar("El recurso no se pudo crear")
      }
    } else {
      this.dialogService.openAlertDialog("No se pudo realizar la solicitud")
    }

  }

  onUpload(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().subscribe(s => {
      this.porcentaje = Math.trunc(s.bytesTransferred * 100 / s.totalBytes) + "%"
      this.completado = false;
      this.finalizando = false;
    })

    task.then(() => {
      ref.getDownloadURL().subscribe(url => {
        this.imagen = url;
        this.finalizando = false;
        this.completado = true;
      })
      this.finalizando = true
    })
  }

  onMultiservicioChange(value) {
    this.multiservicio = value;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }

}