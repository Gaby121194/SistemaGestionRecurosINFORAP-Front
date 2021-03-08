import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecursosmaterialesService } from "src/app/core/services/recursosmateriales.service";
import { TiporecursosmaterialesService } from "src/app/core/services/tiporecursosmateriales.service";
import { TipoRecursoMaterial } from 'src/app/core/models/tiporecursomaterial';
import { StockRecursoMaterial } from 'src/app/core/models/stockrecursomaterial';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecursoMaterialValidator } from 'src/app/core/validators/recursomaterial.validator';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DatePipe } from '@angular/common';
import { RecursoService } from 'src/app/core/services/recurso.service';
import { analytics } from 'firebase';

@Component({
  selector: 'app-form-recursosmateriales',
  templateUrl: './form-recursosmateriales.component.html'
})
export class FormRecursosmaterialesComponent implements OnInit {
  submitted: boolean = false;
  id: number;
  metodo: boolean = false;
  title: string;
  subtitle: string;
  button: string;
  icon: string;
  formGroup: FormGroup;

  stockeable: boolean = false;
  deshabStock: boolean = false;
  multiservicio: boolean = false;
  deshabMulti: boolean = false;
  tempMulti: boolean = false;

  selTiposRecursosMateriales: {}[];

  steps: any[];
  activeStep: number;

  stock: StockRecursoMaterial[];
  filteredStock: StockRecursoMaterial[];
  formGroupStock : FormGroup;
  submittedStock: boolean = false;
  page = 1;

  serviciosAsignados : boolean;

  @Output() onSubmitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder, 
    private basicService: RecursosmaterialesService,
    private tiposMaterialesService: TiporecursosmaterialesService,
    private recursosService : RecursoService,
    public dialog: MatDialog,
    private dialogRef : MatDialogRef<FormRecursosmaterialesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar : MatSnackBar,
    private basicValidator : RecursoMaterialValidator,


  ) { }

  async ngOnInit() { 

    this.sharedService.currentShare.subscribe(x => this.id = x);
    if (this.data?.id) {
      this.sharedService.set(this.data.id);
    }

    await this.createForm();
    this.selTiposRecursosMateriales = await this.getTipos();



  }

  async getTipos(){
      return new Promise<{}[]>(resolve => {
        this.tiposMaterialesService.list().subscribe(s => {
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
  
  createForm(){
    if (this.id > 0 ){

      this.metodo = true;
      this.subtitle = "Modifique los datos correspondientes:" 
      this.title = "Editar Recurso Material"
      this.basicService.getBy(this.id).subscribe(async recurso => {
        this.formGroup = this.fb.group(
          {
            id: this.id,
            marca: [recurso.marca, [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9](.*)')] ],
            modelo: [recurso.modelo, [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validateFields(this.id.toString())],
            multiservicio: recurso.multiservicio,
            stockeable: recurso.stockeable,
            idTipoRecursoMaterial: recurso.idTipoRecursoMaterial,
            idRecurso: recurso.idRecurso,
          }
        );
        this.stockeable = recurso.stockeable;
        this.multiservicio = recurso.multiservicio;
        if (this.multiservicio) {
          this.deshabStock = true;
          this.stockeable = false;
        }
        if (this.stockeable) {
          this.deshabMulti = true;
          this.multiservicio = false;
        }

        if (await (await this.recursosService.ListMaterialesWhereAsignado(recurso.idRecurso).toPromise()).length + (await this.recursosService.listServiciosAsignados(recurso.idRecurso, this.fb.group({name: '', creationDateFrom: null, creationDateTo: null}).value).toPromise()).length > 1){
          this.serviciosAsignados = true;
        }
      })} 
    else {

      this.subtitle = "Complete los siguientes datos:" 
      this.title = "Crear Recurso Material"
      this.formGroup = this.fb.group(
        {
        id: '',
        marca: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9](.*)')]],     
        modelo:  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9](.*)')], this.basicValidator.validField.bind(this)],     
        diasFueraServicio: 0,
        multiservicio: false,
        stockeable: false,
        idTipoRecursoMaterial: '', 
        }
      );
    }
  }

  async save(step){
    if(step == 0){
      if(this.multiservicio){
        this.stockeable = false;
        this.deshabStock = true;
      } else{
        this.deshabStock = false;
      }
      this.formGroup.patchValue({
        multiservicio : this.multiservicio
      }

      )
    }
    if (this.formGroup.valid && this.metodo){
  
        this.basicService.update(this.id,this.formGroup.value).subscribe(s=> {
        this.openSnackBarWithAction("El Recurso fue editado correctamente", "Volver al listado")

        });
      }
      else if (this.formGroup.valid) {
        let recurso = await this.basicService.create(this.formGroup.value).toPromise();
        this.sharedService.set(recurso.id)
        this.openSnackBarWithAction("El Recurso fue creado correctamente", "Volver al listado")
      }
      else {
      alert("los valores ingresados no son válidos")
    }
  }


    


  onMultiservicioChange(value){
    this.multiservicio = value;
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

}
