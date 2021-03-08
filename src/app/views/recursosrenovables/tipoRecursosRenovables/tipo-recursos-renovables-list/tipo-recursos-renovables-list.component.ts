import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoRecursoRenovable } from 'src/app/core/models/tipoRecursoRenovable';
import { ExcelService } from 'src/app/core/services/excel.service';
import { TiporecursorenovableService } from 'src/app/core/services/tiporecursorenovable.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { TipoRecursosRenovablesFormComponent } from '../tipo-recursos-renovables-form/tipo-recursos-renovables-form.component';

@Component({
  selector: 'app-tipo-recursos-renovables-list',
  templateUrl: './tipo-recursos-renovables-list.component.html',
  styleUrls: ['./tipo-recursos-renovables-list.component.scss']
})
export class TipoRecursosRenovablesListComponent implements OnInit {

  tipoRecursosRenovables: TipoRecursoRenovable[]
  filteredTipoRecursoRenovable: TipoRecursoRenovable[];
  page: 1;


  empresas: {}[];
  isSuperUser: boolean;

  formGroup: FormGroup;
  submitted = false;

  hasErrors: boolean;
  constructor(private tipoRecursoRenovableService : TiporecursorenovableService,
    private modalService : MatDialog,
    private confirmService: DialogService,
    private dateValidator : DateValidator,
    private cd : ChangeDetectorRef,
    private fb : FormBuilder,
    private snackBar : MatSnackBar,
    private excelService: ExcelService,
  ) { }

  async ngOnInit(): Promise<void> {
    
   
    this.createForm();
    this.listTipoRecursosRenovables();
    this.cd.detectChanges();
   
  }
 
  listTipoRecursosRenovables(){
    this.tipoRecursoRenovableService.list().subscribe(s=> this.tipoRecursosRenovables = this.filteredTipoRecursoRenovable = s)
  }



  onSearch(){
    this.submitted = true;
    if (this.formGroup.valid) {
      this.tipoRecursoRenovableService.listBy(this.formGroup.value).subscribe(
        s => {
          this.filteredTipoRecursoRenovable = s;
        });
    }
  }

  clear(){
    this.listTipoRecursosRenovables()
    this.createForm();

    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }

  

  async createForm(){
      
      this.formGroup = this.fb.group({
        name: '',
        creationDateFrom:[null, this.dateValidator.mustBeMinor('creationDateTo')],
        creationDateTo:[null, this.dateValidator.mustBeMajor('creationDateFrom')]
      })
    }
  


  create(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    // matDialogConfig.maxHeight = '60%';
    //matDialogConfig.maxWidth = '80%';
    // matDialogConfig.minHeight = '50%';
    // matDialogConfig.minWidth = '50%';
    // matDialogConfig.height = 
  
    const modalRef = this.modalService.open(TipoRecursosRenovablesFormComponent, matDialogConfig);


    modalRef.afterClosed().subscribe(s=> this.tipoRecursoRenovableService.list()
    .subscribe(s => this.tipoRecursosRenovables = this.filteredTipoRecursoRenovable = s))

  }

  edit(id) {
    const dialogRef = this.modalService.open(TipoRecursosRenovablesFormComponent, {
      disableClose: false,
      autoFocus: true,

    });
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(s => {
      this.tipoRecursoRenovableService.listBy(this.formGroup.value).subscribe(s => 
      this.tipoRecursosRenovables = this.filteredTipoRecursoRenovable = s);
    });

  }

  delete(id) {
     
    this.confirmService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
      if(res){
        this.tipoRecursoRenovableService.delete(id).subscribe(s=> {
          this.openSnackBar("El Tipo fue eliminado correctamente")
          this.tipoRecursoRenovableService.list().subscribe(s => this.tipoRecursosRenovables = this.filteredTipoRecursoRenovable = s);
        },
        () => this.openSnackBar("No se puede eliminar un Tipo en uso"));
      }
    });
  }
  
  exportToExcel(){
    let exportdata = this.filteredTipoRecursoRenovable.map(e => {
      return {
        Fecha: e.creationDate.split("T"),
        Descripción: e.descripcion,
        }
    })
    this.excelService.exportAsExcelFile(exportdata,'TipoRecursosRenovables', this.formGroup);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
       duration: 5000,
     });
  }
}
