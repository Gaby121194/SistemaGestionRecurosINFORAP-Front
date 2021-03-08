import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoRecursoRenovable } from 'src/app/core/models/tipoRecursoRenovable';
import { TipoRecurso } from 'src/app/core/models/tipoRecurso';
import { Estado } from 'src/app/core/models/estado';
import { Ubicacion } from 'src/app/core/models/ubicacion';
import { ActivatedRoute, Router } from '@angular/router';
import { RecursosRenovablesService } from 'src/app/core/services/recursosRenovables.service';
import { EstadoService } from 'src/app/core/services/estado.service';
import { UbicacionesService } from 'src/app/core/services/ubicaciones.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TiporecursorenovableService } from 'src/app/core/services/tiporecursorenovable.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {  RecursoRenovableValidator } from 'src/app/core/validators/recursorenovable.validator';
import { createModifiersFromModifierFlags } from 'typescript';
import { DateHelper } from 'src/app/core/helpers/date.helper';

@Component({
  selector: 'app-recursosrenovables-form',
  templateUrl: './recursosrenovables-form.component.html',
  styleUrls: ['./recursosrenovables-form.component.scss']
})
export class RecursosrenovablesFormComponent implements OnInit {

  submitted: boolean = false;
  id: number;
  editable: boolean = false;
  title: string;
  subtitle: string;
  button: string;
  icon: string;
  formGroup: FormGroup;


  tiposRecursosRenovables: TipoRecursoRenovable[];
  selTiposRecursosRenovables: {}[];

  estados: Estado[];
  selEstados: {}[];

  ubicaciones: Ubicacion[];
  selUbicaciones: {}[];

  steps: any[];
  activeStep: number;

  


  constructor(
    private fb: FormBuilder, 
    private activateRoute: ActivatedRoute,
    private router : Router,
    private recursosRenovablesService: RecursosRenovablesService,
    private tiposRecursosRenovablesService: TiporecursorenovableService,
    private estadoService: EstadoService,
    private ubicacionService: UbicacionesService,
    private sharedService : SharedService,
    private datePipe: DatePipe,
    private basicValidator : RecursoRenovableValidator,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<RecursosrenovablesFormComponent>,
    private authService : AuthenticationService,
    private snackBar : MatSnackBar,
    private dateHelper: DateHelper,
  ) { }

  async ngOnInit(): Promise<void> { 
    

    await this.createForm();
    this.selTiposRecursosRenovables = await this.getTipos();
    this.selUbicaciones = await this.getUbicaciones();

    
  }

  
  async getTipos(){
    return new Promise<{}[]>(resolve => {
      this.tiposRecursosRenovablesService.list().subscribe(s => {
        resolve(s.map(k => {
          return {
            key: k.id,
            value: k.descripcion
          }
        }));
        return;
      });
    });
  }

    
  async getUbicaciones(){
    return new Promise<{}[]>(resolve => {
      this.ubicacionService.list().subscribe(s => {
        resolve(s.map(k => {
          return {
            key: k.id,
            value: k.referencia
          }
        }));
        return;
      });
    });
  }

    createForm() {
      console.log(this.id);
      if (this.id > 0 ){
        console.log("estas en editar")
        this.editable = true;
        this.subtitle = "Modifique los datos correspondientes:" 
        this.title = "Editar Recurso Renovable"
        this.button = "Editar"
        this.recursosRenovablesService.getBy(this.id).subscribe(s=>{
          
          console.log(s)
          this.formGroup = this.fb.group(
            {
              id: this.id,
              descripcion: [s.idRecursoNavigation.descripcion,[Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validateFields(this.id.toString())],     
              idRecurso: s.idRecurso,
              fechaVencimiento: [this.datePipe.transform(s.fechaVencimiento, 'dd-MM-yyyy'), [Validators.required]],
              idTipoRecursoRenovable: s.idTipoRecursoRenovable,
              idUbicacion: [s.idRecursoNavigation.idUbicacion, [Validators.required]],
              idTipoRecurso: [s.idTipoRecursoRenovable],
              
            
            }); 
            console.log(this.formGroup.value)
            
          });
      } 
      else {
        this.subtitle = "Complete los siguientes datos:" 
        this.title = "Crear Recurso Renovable"
        this.icon = "add";
        this.button = "Crear"
        
        this.formGroup = this.fb.group(
          {
            id: '',
            descripcion:  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validField.bind(this)],     
            idRecurso: [''],
            fechaVencimiento: ['', [Validators.required]],
            idTipoRecursoRenovable: ['', Validators.required],
            idUbicacion: ['', [Validators.required]],
            idTipoRecurso: [''],
          }
        );
        console.log(this.formGroup)
      }
    }
    
  


  async save(){
    if (this.formGroup.valid) {
      var date= this.dateHelper.ParseDateToString(this.formGroup.get('fechaVencimiento').value)
      this.formGroup.patchValue({ 
        fechaVencimiento: date })

    if (this.editable){
      
        this.recursosRenovablesService.update(this.id,this.formGroup.value).subscribe(
          () => this.openSnackBar("El recurso renovable fue editado correctamente")
        ,
          () => this.openSnackBar("El recurso no se pudo editar")
         )
        }
      
    else {
        console.log(this.formGroup.value)
         await this.recursosRenovablesService.create(this.formGroup.value).subscribe(
          () => this.openSnackBar("El recurso renovable fue creado correctamente")
          ,
            () => this.openSnackBar("El recurso no se pudo crear")
           )
     }
}
}

openSnackBar(message: string) {
  this.snackBar.open(message, "", {
    duration: 5000,
  });
}

  openSnackBarWithAction(message: string, action : string) {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
    });
    snackBarOpened.onAction().subscribe(()=> {
       this.dialogRef.close(true);
    })
  }


  onTiposRecursosChange(value){
    console.log(value)
  }


  onTipoRecursoRenovablesChange(value){
    console.log(value)
  }

  onEstadosChange(value){
    console.log(value)
  }

  onUbicacionesChange(value){
    console.log(value)
  }

  


 
}
