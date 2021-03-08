import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { View } from 'src/app/core/models/view';
import { ExcelService } from 'src/app/core/services/excel.service';
import { FuncionalidadService } from 'src/app/core/services/funcionalidad.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormFuncionalidadComponent } from '../form-funcionalidad/form-funcionalidad.component';

@Component({
  selector: 'app-list-funcionalidad',
  templateUrl: './list-funcionalidad.component.html'
})
export class ListFuncionalidadComponent implements OnInit {

  constructor(private funcionalidadService: FuncionalidadService,
    private dateValidator: DateValidator,
    private cd: ChangeDetectorRef,
    private confirmService: DialogService,
    private snackbar : MatSnackBar,
    private excelService: ExcelService,
    private modalService : MatDialog,
    private sidebarService : SidebarService,
    private fb: FormBuilder) { }
  funcionalidades:View[];
  formGroup: FormGroup;
  submitted = false;
  page = 1;
  hasErrors: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loadFormGroup();
    await this.listFuncionalidad();
  }

  async listFuncionalidad() {    
      this.funcionalidades = await this.funcionalidadService.list(this.formGroup.value).toPromise();   
      this.sidebarService.reloadMenuItems();
  }
  loadFormGroup() {
    this.formGroup = this.fb.group({
      name: "",
      creationDateFrom: null,
      creationDateTo: [null, this.dateValidator.mustBeMajor("creationDateFrom")]
    });
  }
  async onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      await this.listFuncionalidad();
    }
  }

  create() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = "50%";
    matDialogConfig.height = "90%";
    const modalRef = this.modalService.open(FormFuncionalidadComponent, matDialogConfig);
    modalRef.afterClosed().subscribe(async ()=> await this.listFuncionalidad())
   }
  edit(id) { 
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = "50%";
    matDialogConfig.height = "90%";
    const modalRef = this.modalService.open(FormFuncionalidadComponent, matDialogConfig);
    modalRef.componentInstance.id = id;
    modalRef.afterClosed().subscribe(async ()=> await this.listFuncionalidad())
  }
  clear() {
    this.loadFormGroup();
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
    this.listFuncionalidad();
  }

  disable(id) {
    this.confirmService.openConfirmDialog("¿Está seguro que desea deshabilitar la funcionalidad para todos los usuarios?").afterClosed().subscribe( res => {
      if(res){
        this.funcionalidadService.disable(id).subscribe(async ()=> {
          this.openSnackBar("La funcionalidad fue deshabilitada correctamente")
          await this.listFuncionalidad();
        });
      }
    });
  }

  enable(id){
    this.confirmService.openConfirmDialog("¿Está seguro que desea habilitar la funcionalidad para todos los usuarios?").afterClosed().subscribe(res => {
      if(res){
        this.funcionalidadService.enable(id).subscribe(async ()=> {
          this.openSnackBar("La funcionalidad fue habilitada correctamente")
          await this.listFuncionalidad();
        });
      }
    });
  }
  exportToExcel(){
    let exportdata = this.funcionalidades.map(e => {
      return {
        Fecha: e.creationDate.split("T")[0],
        "Nombre a mostrar" : e.display,
        Url: e.url,
        Mostrar: e.show == true?"Si":"No",        
        Activa: e.active == true?"Si":"No"        
        }
    })
    this.excelService.exportAsExcelFile(exportdata,'Funcionalidad', this.formGroup);
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, "", {
       duration: 5000,
     });
  }
}
