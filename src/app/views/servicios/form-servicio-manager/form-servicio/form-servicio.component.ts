import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

import { SharedService } from 'src/app/core/services/shared.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RecursosHumanosService } from 'src/app/core/services/recursos-humanos.service';
import { ServiciosService } from 'src/app/core/services/servicios.service';
import { ServicioRecurso } from 'src/app/core/models/servicio-recurso';
import { ServicioValidator } from 'src/app/core/validators/servicio.validator';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormServicioManagerComponent } from '../form-servicio-manager.component';
import { Servicio } from 'src/app/core/models/servicio';
import { DateHelper } from 'src/app/core/helpers/date.helper';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { RecursoService } from 'src/app/core/services/recurso.service';

@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.component.html'
})
export class FormServicioComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private rrhhService: RecursosHumanosService,
    private recursoService: RecursoService,
    private serviciosService: ServiciosService,
    private clientService: ClienteService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private dateValidator: DateValidator,
    private datePipe: DatePipe,
    private dateHelper: DateHelper,
    private servicioValidator: ServicioValidator,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormServicioManagerComponent>,
    private snackBar: MatSnackBar) { }
  submitted: boolean = false;
  formGroup: FormGroup;
  title: string = "Crear";
  subtitle: string = "Ingrese los datos del servicio";
  icon: string = "arrow_right";
  button: string = "Guardar y continuar";
  clients: {}[];
  id: any;
  humanResources: any[];
  @Output() onSubmitEvent: EventEmitter<any> = new EventEmitter<any>();

  async ngOnInit() {
    this.sharedService.currentShare.subscribe(x => this.id = x);
    if (this.data?.id) {
      this.sharedService.set(this.data.id);
    }
    this.humanResources = await this.listHumanResources();
    this.clients = await this.listClients();
    await this.loadFormGroup();
  }
  onClientChanges(data) {
  }
  async save() {
    this.submitted = true;
    if (this.formGroup.valid) {

      if (!this.id) {
        await this.create(this.formGroup.value);
      } else {
        await this.edit(this.formGroup.value);
      }
    }
  }

  async create(formValue) {
    formValue.fechaInicio = this.dateHelper.ParseDateToString(this.formGroup.controls["fechaInicio"].value);
    formValue.fechaFin = this.dateHelper.ParseDateToString(this.formGroup.controls["fechaFin"].value);
    
    let servicio = await this.serviciosService.insert(formValue).toPromise();
    this.sharedService.set(servicio.id);
    this.onSubmitEvent.emit();
  }
  async edit(formValue) {
    formValue.fechaInicio = this.dateHelper.ParseDateToString(this.formGroup.controls["fechaInicio"].value);
    formValue.fechaFin = this.dateHelper.ParseDateToString(this.formGroup.controls["fechaFin"].value);
    try {
      let servicio = await this.serviciosService.update(this.id, formValue).toPromise();      
      this.openSnackBar("El servicio fue editado correctamente", "Volver al listado")
    } catch (error) {
      this.openSnackBar("Ocurrió un error","")
    }
  }

  async listHumanResources() {
    return new Promise<{}[]>(resolve => {
      this.recursoService.listRecursosHumanosAvailable().subscribe(s => {
        resolve(s.map(e => {
          return {
            key: e.id,
            value: `${e.nombre}, ${e.apellido} - ${e.cuil}`
          }
        }));
        return;
      })
    })
  }
  async listClients() {
    let result = await this.clientService.list().toPromise();
    return result.map(s => {
      return {
        key: s.id,
        value: `${s.razonSocial} - ${s.cuil}`
      }
    });
  }
  async loadFormGroup() {
    if (!this.id) {
      this.formGroup = this.fb.group(
        {
          id: null,
          nombre: ['', [Validators.required], this.servicioValidator.validateFields()],
          nroContrato: ['', [Validators.required, Validators.pattern("[0-9]+")], this.servicioValidator.validateFields()],
          objetivo: '',
          fechaInicio: ['', Validators.required],
          fechaFin: ['', [Validators.required, this.dateValidator.mustBeMajor("fechaInicio")]],
          idCliente: ['', Validators.required],
          idRecursoHumano1: ['', Validators.required],
        });
    } else {
      let servicio = await this.serviciosService.getBy(this.id).toPromise();
      let rrhh = await this.rrhhService.getBy(servicio.idRecursoHumano1).toPromise();
      if (rrhh) {
        this.humanResources.push( { 
           key: rrhh.id,
           value: `${rrhh.nombre}, ${rrhh.apellido} - ${rrhh.cuil}`
        });
      }
      this.formGroup = this.fb.group(
        {
          id: servicio.id,
          nombre: [servicio.nombre, [Validators.required], this.servicioValidator.validateFields(servicio.id.toString())],
          nroContrato: [servicio.nroContrato, [Validators.required, Validators.pattern("[0-9]+")], this.servicioValidator.validateFields(servicio.id.toString())],
          objetivo: servicio.objetivo,
          fechaInicio: [this.datePipe.transform(servicio.fechaInicio, 'dd-MM-yyyy'), Validators.required],
          fechaFin: [this.datePipe.transform(servicio.fechaFin, 'dd-MM-yyyy'), [Validators.required, this.dateValidator.mustBeMajor("fechaInicio")]],
          idCliente: [servicio.idCliente, Validators.required],
          idRecursoHumano1: [servicio.idRecursoHumano1, Validators.required],
        });
    
      this.title = "Editar Servicio";
      this.subtitle = "Modifica los datos del servicio";
      this.icon = "edit";
      this.button = "Editar";
    }
  }

  async generateContractNumber() {
    let contractNumber = await this.serviciosService.generateContractNumber().toPromise();
    let control = this.formGroup.controls["nroContrato"];
    if (contractNumber && control) {
      control.setValue(contractNumber.contractNumber);
    }
    this.cd.detectChanges();
  }

  openSnackBar(message: string, action: string) {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });
   snackBarOpened.onAction().subscribe(()=>{
    this.dialogRef.close(true);
   })
  }
  onNoClick(){
    this.dialogRef.close(false);
  }
}