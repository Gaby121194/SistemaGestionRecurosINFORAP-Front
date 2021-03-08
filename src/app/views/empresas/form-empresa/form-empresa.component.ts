import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { EmpresaValidator } from "src/app/core/validators/empresa.validator";
import { DialogService } from 'src/app/shared/dialog.service';
import { UserValidator } from 'src/app/core/validators/user.validator';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-form-empresa',
  templateUrl: './form-empresa.component.html',
  styleUrls: ['./form-empresa.component.scss']
})
export class EmpresaFormComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;
  id: number;
  metodo: boolean = false;
  title: string;
  subtitle: string;
  icon: string;
  button: string;

  uploadPercent: Observable<number>;
  logo: string;

  finalizando = false;
  completado: boolean = false;

  @ViewChild('ImageUser' ) InputImageUser: ElementRef;
  porcentaje: any;

  constructor(private fb: FormBuilder,
    private basicService: EmpresasService,
    private storage : AngularFireStorage,
    private empresaValidator : EmpresaValidator,
    private userValidator : UserValidator,
    private dialogService : DialogService,
    private snackBar : MatSnackBar,
    private userService: UsuariosService,
  ) { }

  ngOnInit(): void {
    if (this.id > 0) {
      this.metodo = true;
      this.title = 'Editar Empresa';
      this.subtitle = 'Modifique los datos correspondientes:';
      this.button = 'Modificar';
      this.icon = 'edit'
      this.basicService.getBy(this.id).subscribe( s => {
        this.formGroup = this.fb.group(
          {
            id: [this.id],
            razonSocial: [s.razonSocial, [Validators.required], this.empresaValidator.validateFields(this.id.toString())],
            domicilio: [s.domicilio, [ Validators.required, Validators.minLength(3)]],
            logo: s.logo,
            cuit: [s.cuit, [Validators.required, Validators.pattern("(20|23|27|30|33)([0-9]{9})")], this.empresaValidator.validateFields(this.id.toString())],
            telefono: [s.telefono, Validators.required],
            correoContacto: [s.correoContacto, [Validators.required, Validators.email]],
            usuarioContacto: [s.usuarioContacto, Validators.required],
          });
          this.logo = s.logo
      });
    } else {
      this.title = 'Crear Empresa';
      this.subtitle = 'Complete los siguientes datos:';
      this.button = 'Crear';
      this.icon = 'add';
      this.logo = "./assets/images/profile.jpg";
      this.formGroup = this.fb.group(
        {
          id: '',
          razonSocial: ['', [Validators.required], this.empresaValidator.validField.bind(this)],
          domicilio: ['', Validators.required],
          logo: '',
          cuit: ['', [Validators.required, Validators.pattern("(20|23|27|30|33)([0-9]{9})")],this.empresaValidator.validField.bind(this)],
          telefono: ['', [Validators.required, Validators.pattern("[0-9]*")]],
          correoContacto: ['', [Validators.required, Validators.email], this.empresaValidator.validField.bind(this)],
          usuarioContacto: ['', Validators.required],
          emailManager: ['', [Validators.required, Validators.email], this.userValidator.validUsername.bind(this)],
          nombreManager: ['', [Validators.required, Validators.pattern("^([a-zA-ZÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ\\s])+$")]],
          apellidoManager:  ['', [Validators.required, Validators.pattern("^([a-zA-ZÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ\\s])+$")]],
        }
      );
    }
  }
  
  onUpload(e){
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().subscribe(s=>{
      this.porcentaje = Math.trunc(s.bytesTransferred * 100 /s.totalBytes) + "%"
      this.completado = false;
      this.finalizando = false;
    })

    task.then(() => {
      ref.getDownloadURL().subscribe(url => {
        this.logo = url;
        this.finalizando = false;
        this.completado = true;
      })
      this.finalizando = true
      })
      
    
  }


  save(){
    if(this.logo.length > 0 ){
      this.formGroup.patchValue({
        logo: this.logo
      })
    }
   

    if (this.metodo && this.formGroup.valid){
      this.basicService.update(this.id,this.formGroup.value).subscribe(
        () => this.openSnackBar("La Empresa fue editada correctamente")
      )
    }
    else if (this.formGroup.valid){
      this.basicService.create(this.formGroup.value).subscribe(
        () => this.openSnackBar("La Empresa fue creada correctamente")
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