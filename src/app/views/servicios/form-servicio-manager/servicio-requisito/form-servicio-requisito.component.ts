import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoReglaService } from 'src/app/core/services/tipo-regla.service';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { TiporecursosmaterialesService } from 'src/app/core/services/tiporecursosmateriales.service';
import { Requisito } from 'src/app/core/models/requisito';
import { TipoRecursoEnum } from 'src/app/core/enums/tipo-recurso.enum';
import { RequisitosService } from 'src/app/core/services/requisitos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiporecursorenovableService } from 'src/app/core/services/tiporecursorenovable.service';

@Component({
  selector: 'app-form-servicio-requisito',
  templateUrl: './form-servicio-requisito.component.html'
})
export class FormServicioRequisitoComponent implements OnInit {
  idServicio : number;
  typeRules: any[];
  typeRequisites: any[];
  uTiempo: any[];
  activeForm: any;
  resourceTypes: any[];
  resourcesTypesMixed: any[]
  resourcesTypesMaterial: any[];
  resourcesTypesRenewable: any[];
  formGroup: FormGroup[];
  submitted = false;
  constructor(private tipoReglaService: TipoReglaService,
    public dialogRef: MatDialogRef<FormServicioRequisitoComponent>,    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tiporecursosmaterialesService: TiporecursosmaterialesService,
    private tipoRecursoRenovableService: TiporecursorenovableService,
    private requisitosService :RequisitosService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  async ngOnInit() {
    if(!this.data?.idServicio){
      this.onNoClick();
      this.openSnackBar("Ocurrió un error");
    }
    this.idServicio = this.data.idServicio;
    await this.getTypeRules();
    await this.getResourceType();
    this.getTypeRequisites();
    this.getuTiempo();
  }

  async getTypeRules() {
    this.activeForm = 0;
    let rules = await this.tipoReglaService.list().toPromise();
    this.typeRules = rules.map((s, i) => {
      return {
        id: s.id,
        descripcion: s.descripcion,
        active: i == 0
      }
    });
    this.formGroup = new Array<FormGroup>();
    this.typeRules.forEach(rule => {
      this.formGroup.push(this.loadFormsData(rule.id));
    })
  }

  loadFormsData(idRuleType) {
    switch (idRuleType) {
      case 1:
        return this.fb.group(
          {
            descripcion: ['', Validators.required],
            idTipoRequisito: ['', Validators.required],
            IdTipoRecursoMaterial1: ['', Validators.required],
            IdTipoRecursoMaterial2: ['', Validators.required],
            periodicidad: ['', Validators.required],
            IdTipoRecursoRenovable: null,
            idUtiempo: ['', Validators.required]
          });
      case 2:
        return this.fb.group(
          {
            descripcion: ['', Validators.required],
            idTipoRequisito: ['', Validators.required],
            IdTipoRecursoMaterial1: ['', Validators.required],
            IdTipoRecursoMaterial2: null,
            periodicidad: null,
            IdTipoRecursoRenovable: ['', Validators.required],
            idUtiempo: null
          });
      case 3:
        return this.fb.group(
          {
            descripcion: ['', Validators.required],
            idTipoRequisito: ['', Validators.required],
            IdTipoRecursoMaterial1: ['', Validators.required],
            IdTipoRecursoMaterial2: ['', Validators.required],
            periodicidad: null,
            IdTipoRecursoRenovable: null,
            idUtiempo: null
          });
      case 4:
        return this.fb.group(
          {
            descripcion: ['', Validators.required],
            idTipoRequisito: ['', Validators.required],
            IdTipoRecursoMaterial1: ['', Validators.required],
            IdTipoRecursoMaterial2: null,
            periodicidad: ['', Validators.required],
            IdTipoRecursoRenovable: null,
            idUtiempo: ['', Validators.required]
          });
      case 5:
        return this.fb.group(
          {
            descripcion: ['', Validators.required],
            idTipoRequisito: ['', Validators.required],
            IdTipoRecursoMaterial1: ['', Validators.required],
            IdTipoRecursoMaterial2: null,
            periodicidad: ['', Validators.required],
            IdTipoRecursoRenovable: null,
            idUtiempo: ['', Validators.required]
          });

      default:
        break;
    }
  }
  async create(formData) {
    let saveData: Requisito;
    switch (this.activeForm) {
      case 0: {
        let IdTipoRecursoMaterial1 = Number(formData.IdTipoRecursoMaterial1);
        let IdTipoRecursoMaterial1Selected =  IdTipoRecursoMaterial1 != 1 ? Number(this.resourceTypes[IdTipoRecursoMaterial1 - 2].id) : null;
        saveData = new Requisito();  
        saveData.idTipoRegla = Number(this.typeRules[this.activeForm].id); 
        saveData.idServicio = this.idServicio;
        saveData.activo = true;
        saveData.descripcion= formData.descripcion;
        saveData.idTipoRequisito= formData.idTipoRequisito;
        saveData.idTipoRecursoMaterial1 = IdTipoRecursoMaterial1Selected;
        saveData.idTipoRecursoMaterial2= Number(formData.IdTipoRecursoMaterial2);
        saveData.idTipoRecurso1 = IdTipoRecursoMaterial1 == 1 ? TipoRecursoEnum["Recurso Humano"] : TipoRecursoEnum["Recurso Material"];
        saveData.idTipoRecurso2= TipoRecursoEnum["Recurso Material"];
        saveData.habilitado = true;
        saveData.periodicidad = formData.periodicidad;
        saveData.idUtiempo = formData.idUtiempo;         
        break;
      }
      case 1:{
        let IdTipoRecursoMaterial1 = Number(formData.IdTipoRecursoMaterial1);
        let IdTipoRecursoMaterial1Selected =  IdTipoRecursoMaterial1 != 1 ? Number(this.resourceTypes[IdTipoRecursoMaterial1 - 2].id) : null;
        saveData = new Requisito();  
        saveData.idTipoRegla = Number(this.typeRules[this.activeForm].id); 
        saveData.idServicio = this.idServicio;
        saveData.activo = true;
        saveData.descripcion= formData.descripcion;
        saveData.idTipoRequisito= formData.idTipoRequisito;
        saveData.idTipoRecursoMaterial1 = IdTipoRecursoMaterial1Selected;
        saveData.idTipoRecursoMaterial2= null;
        saveData.idTipoRecurso1 = IdTipoRecursoMaterial1 == 1 ? TipoRecursoEnum["Recurso Humano"] : TipoRecursoEnum["Recurso Material"];
        saveData.idTipoRecurso2= TipoRecursoEnum["Recurso Renovable"];
        saveData.idTipoRecursoRenovable = formData.IdTipoRecursoRenovable,
        saveData.habilitado = true;
        saveData.periodicidad = null;
        saveData.idUtiempo = null;         
        break;
      }
      case 2: {
        let IdTipoRecursoMaterial1 = Number(formData.IdTipoRecursoMaterial1);
        let IdTipoRecursoMaterial1Selected =  IdTipoRecursoMaterial1 != 1 ? Number(this.resourceTypes[IdTipoRecursoMaterial1 - 2].id) : null;
        saveData = new Requisito();
        saveData.idTipoRegla = Number(this.typeRules[this.activeForm].id); 
        saveData.idServicio = this.idServicio;
        saveData.activo = true;
        saveData.descripcion= formData.descripcion;
        saveData.idTipoRequisito= formData.idTipoRequisito;
        saveData.idTipoRecursoMaterial1 = IdTipoRecursoMaterial1Selected;
        saveData.idTipoRecursoMaterial2= Number(formData.IdTipoRecursoMaterial2);
        saveData.idTipoRecurso1 = IdTipoRecursoMaterial1 == 1 ? TipoRecursoEnum["Recurso Humano"] : TipoRecursoEnum["Recurso Material"];
        saveData.idTipoRecurso2= TipoRecursoEnum["Recurso Material"];
        saveData.habilitado = true;
        saveData.periodicidad = null;
        saveData.idUtiempo = null;         
        break;
      }
      case 3: {
        let IdTipoRecursoMaterial1 = Number(formData.IdTipoRecursoMaterial1);
       // let IdTipoRecursoMaterial1Selected =  IdTipoRecursoMaterial1 != 1 ? Number(this.resourceTypes[IdTipoRecursoMaterial1 - 2].id) : null;
        saveData = new Requisito();  
        saveData.idTipoRegla = Number(this.typeRules[this.activeForm].id); 
        saveData.idServicio = this.idServicio;
        saveData.activo = true;
        saveData.descripcion= formData.descripcion;
        saveData.idTipoRequisito= formData.idTipoRequisito;
        saveData.idTipoRecursoMaterial1 = IdTipoRecursoMaterial1;
        saveData.idTipoRecursoMaterial2= null;
        saveData.idTipoRecurso1 = TipoRecursoEnum["Recurso Material"];
        saveData.idTipoRecurso2= null;
        saveData.habilitado = true;
        saveData.periodicidad = formData.periodicidad;
        saveData.idUtiempo = formData.idUtiempo;         
        break;
      }
      case 4: {
        let IdTipoRecursoMaterial1 = Number(formData.IdTipoRecursoMaterial1);
        let IdTipoRecursoMaterial1Selected =  IdTipoRecursoMaterial1 != 1 ? Number(this.resourceTypes[IdTipoRecursoMaterial1 - 2].id) : null;
        saveData = new Requisito();  
        saveData.idTipoRegla = Number(this.typeRules[this.activeForm].id); 
        saveData.idServicio = this.idServicio;
        saveData.activo = true;
        saveData.descripcion= formData.descripcion;
        saveData.idTipoRequisito= formData.idTipoRequisito;
        saveData.idTipoRecursoMaterial1 = IdTipoRecursoMaterial1Selected;
        saveData.idTipoRecursoMaterial2= null
        saveData.idTipoRecurso1 = IdTipoRecursoMaterial1 == 1 ? TipoRecursoEnum["Recurso Humano"] : TipoRecursoEnum["Recurso Material"];
        saveData.idTipoRecurso2= null;
        saveData.habilitado = true;
        saveData.periodicidad = formData.periodicidad;
        saveData.idUtiempo = formData.idUtiempo;         
        break;
      }
      default:
        break;
    }
    this.requisitosService.create(this.idServicio,saveData).subscribe(s=>{
      this.dialogRef.close(true);
      this.openSnackBar("Requisito creado exitósamente")
    });
  }
  getTypeRequisites() {
    this.typeRequisites = [
      { key: 1, value: "Legal" },
      { key: 2, value: "De servicio" }
    ];
  }
  getuTiempo() {
    this.uTiempo = [
      { key: 1, value: "Día/s" },
      { key: 2, value: "Mes/es" },
      { key: 3, value: "Año/s" }
    ];
  }
  showFormForRule(i) {
    this.typeRules[this.activeForm].active = false;
    this.typeRules[i].active = true;
    this.activeForm = i;
  }
  async getResourceType() {
    this.resourceTypes = await this.tiporecursosmaterialesService.list().toPromise();
    this.resourcesTypesMixed = new Array<{}>();
    this.resourcesTypesMixed.push({key : 1 , value : "Recurso Humano"})
    this.resourceTypes.forEach((s,i)=>{
      this.resourcesTypesMixed.push({key : i + 2 , value : s.descripcion})
    });
    // this.resourcesTypesMixed = this.resourceTypes
    //   .map((s, i) => {
    //     return {
    //       key: i + 1,
    //       value: s.descripcion
    //     }
    //   });
    this.resourcesTypesMaterial = await (await this.tiporecursosmaterialesService.list().toPromise())
      .map((s) => {
        return {
          key: s.id,
          value: s.descripcion
        }
      });
    this.resourcesTypesRenewable = await (await this.tipoRecursoRenovableService.list().toPromise())
      .map((s) => {
        return {
          key: s.id,
          value: s.descripcion
        }
      });

    // this.resourceTypes = [
    //   { key: 1, value: "Recurso Humano" },
    //   { key: 2, value: "Vehiculo" },
    //   { key: 3, value: "Elementos de seguridad" }
    // ]
  }
  save() {
    this.submitted = true;
    console.log(this.formGroup[this.activeForm].valid)
    if (this.formGroup[this.activeForm].valid && this.idServicio) {
      console.log("is valid!")
      this.create(this.formGroup[this.activeForm].value)
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
 openSnackBar(message: string, action: string = "") {
   let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });
   
  }
}
