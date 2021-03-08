import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permiso } from 'src/app/core/models/permiso';
import { Rol } from 'src/app/core/models/rol';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { RolesFormComponent } from '../../roles/roles-form/roles-form.component';
import { FormPermisosComponent } from '../form-permisos/form-permisos.component';

@Component({
  selector: 'app-list-permisos',
  templateUrl: './list-permisos.component.html'
})
export class ListPermisosComponent implements OnInit {

  permisos: Permiso[]
  page: 1;

  formGroup: FormGroup;
  submitted = false;

  hasErrors: boolean;
  constructor(private basicService: PermisosService,
    private modalService: MatDialog,
    private confirmService: DialogService,
    private dateValidator: DateValidator,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private excelService: ExcelService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadForm();
    await this.listPermisos();
  }

  async listPermisos() {
    this.permisos = await this.basicService.list().toPromise();
  }


  onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.basicService.listBy(this.formGroup.value).subscribe(
        s => {
          this.permisos = s;
        });
    }
  }

  clear() {
    this.loadForm();
    this.listPermisos()
    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }



  loadForm = () => this.formGroup = this.fb.group({
    name: '',
    creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")],
    creationDateTo: [null, this.dateValidator.mustBeMajor('creationDateFrom')]
  });

  create() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = "50%";
    matDialogConfig.height = "90%";
    const modalRef = this.modalService.open(FormPermisosComponent, matDialogConfig);
    modalRef.afterClosed().subscribe(async s => this.listPermisos());
  }

  edit(id) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;
    matDialogConfig.width = "50%";
    matDialogConfig.height = "90%";
    const modalRef = this.modalService.open(FormPermisosComponent, matDialogConfig);
    modalRef.componentInstance.id = id;
    modalRef.afterClosed().subscribe(async s => this.listPermisos());
  }

  disable(id) {
    this.confirmService.openConfirmDialog("¿Está seguro que desea deshabilitar el permiso, se deshabilitaran todas las funcionalidades asociadas?").afterClosed().subscribe( res => {
      if(res){
        this.basicService.disable(id).subscribe(async ()=> {
          this.openSnackBar("El permiso fue deshabilitado correctamente")
          await this.listPermisos();
        });
      }
    });
  }

  enable(id){
    this.confirmService.openConfirmDialog("¿Está seguro que desea habilitar el permiso, se habilitaran todas las funcionalidades asociadas?").afterClosed().subscribe(res => {
      if(res){
        this.basicService.enable(id).subscribe(async ()=> {
          this.openSnackBar("El permiso fue habilitado correctamente")
          await this.listPermisos();
        });
      }
    });
  }

  exportToExcel() {
    let exportdata = this.permisos.map(e => {
      return {
        Fecha: e.creationDate.split("T"),
        Nombre: e.nombrePermiso,
        Descripción: e.descripcionPermiso,
      }
    })
    this.excelService.exportAsExcelFile(exportdata, 'Permisos', this.formGroup);
  }

  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
