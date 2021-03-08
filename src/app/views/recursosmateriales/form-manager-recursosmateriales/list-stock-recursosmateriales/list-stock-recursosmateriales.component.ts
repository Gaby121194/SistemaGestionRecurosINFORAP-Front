import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecursoMaterial } from 'src/app/core/models/recursosmateriales';
import { StockRecursoMaterial } from 'src/app/core/models/stockrecursomaterial';
import { ExcelService } from 'src/app/core/services/excel.service';
import { RecursosmaterialesService } from 'src/app/core/services/recursosmateriales.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { StockrecursosmaterialesService } from 'src/app/core/services/stockrecursosmateriales.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';
import { StockRecursoMaterialFormComponent } from '../../stockrecursomaterial/stock-recurso-material-form.component';

@Component({
  selector: 'app-list-stock-recursosmateriales',
  templateUrl: './list-stock-recursosmateriales.component.html'
})
export class ListStockRecursosmaterialesComponent implements OnInit {
  id: number;
  recurso: RecursoMaterial;
  stock: StockRecursoMaterial[];
  filteredStock: StockRecursoMaterial[];
  formGroupRecurso: FormGroup;
  formGroupStock: FormGroup;
  submittedStock: boolean = false;
  stockeable: boolean = false;
  deshabStock: boolean = false;
  page = 1;
  hasErrors: boolean;
  subtitle : string;
  constructor(
    private stockRecursosMaterialesService: StockrecursosmaterialesService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private dateValidator: DateValidator,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private basicService: RecursosmaterialesService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<StockRecursoMaterialFormComponent>,


  ) { }

  async ngOnInit() {

    await this.sharedService.currentShare.subscribe(x => {
      this.id = x,
        this.getRecurso(x)


    });
    this.createFormStock();
    this.getStock();
  }

  getStock() {
    this.stockRecursosMaterialesService.list(this.id).subscribe(s => {
      this.stock = this.filteredStock = s,
        this.HabilitadorCheckbox()
    })
  }

  HabilitadorCheckbox() {
    if (this.stock.length > 0) {
      this.deshabStock = true;
    } else {
      this.deshabStock = false;
    }
   if (this.recurso.boolAsignados){
      this.deshabStock = true;
      this.stockeable = false;
    }
    if (this.recurso.multiservicio){
      this.deshabStock = true;
      this.stockeable = false;
    }
    if (this.recurso.idRecursoNavigation.idEstado == 3){
      this.deshabStock = true;
      this.stockeable = false;
    }
  }



  async getRecurso(id) {
    this.recurso = await this.basicService.getBy(id).toPromise();
    this.subtitle = this.recurso.marca + " " + this.recurso.modelo;
    this.stockeable = this.recurso.stockeable;

    this.formGroupRecurso = this.fb.group(
      {
        id: this.recurso.id,
        marca: this.recurso.marca,
        modelo: this.recurso.modelo,
        multiservicio: this.recurso.multiservicio,
        stockeable: this.recurso.stockeable,
        idTipoRecursoMaterial: this.recurso.idTipoRecursoMaterial,
        idRecurso: this.recurso.idRecurso,
      }
    );
  }

  exportToExcelStock() {
    if (this.filteredStock.length > 0){
      let exportdata = this.filteredStock.map(e => {
        return {
          Fecha: e.creationDate.split("T")[0],
          Total: e.cantidadTotal,
          Disponible: e.cantidadDisponible,
          Ubicación: e.refUbicacion,
        }
      })
      this.excelService.exportAsExcelFile(exportdata, "Stock " + `${this.recurso.marca}`+ ` ${this.recurso.modelo}`, this.formGroupStock)
  
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }
   
  }



  onSearchStock() {
    this.submittedStock = true;
    if (this.formGroupStock.valid) {
      this.stockRecursosMaterialesService.listBy(this.id, this.formGroupStock.value).subscribe(
        s => {
          this.filteredStock = s;
        }

      );
    }
  }
  onStockeableChange(value) {
    this.formGroupRecurso.patchValue({
      stockeable: value
    })
    if (this.formGroupRecurso.valid) {

      this.basicService.update(this.id, this.formGroupRecurso.value).subscribe(s => {
        this.openSnackBarWithAction("El Recurso fue editado correctamente", "Volver al listado")

      });
    }




    this.stockeable = value
  }

  clearStock() {
    this.createFormStock();
    this.getStock();

    this.hasErrors = true;
    this.cd.detectChanges();
    this.hasErrors = false;
  }

  createFormStock() {
    this.formGroupStock = this.fb.group({
      name: '',
      creationDateFrom: [null],
      creationDateTo: [null, this.dateValidator.mustBeMajor('creationDateFrom')]
    })
  }

  createStock() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;

    const ref = this.dialog.open(StockRecursoMaterialFormComponent, matDialogConfig)
    ref.componentInstance.idRecursoMaterial = this.id;

    ref.afterClosed().subscribe(s =>
      this.stockRecursosMaterialesService.list(this.id).subscribe(s => {
        this.stock = this.filteredStock = s,
          this.HabilitadorCheckbox()
      }
      ),
    );
  }

  editStock(id) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = false;
    matDialogConfig.autoFocus = true;

    const ref = this.dialog.open(StockRecursoMaterialFormComponent, matDialogConfig)
    ref.componentInstance.id = id

    ref.afterClosed().subscribe(s => {
      this.stockRecursosMaterialesService.listBy(this.id, this.formGroupStock.value).subscribe(
        s => {
          this.filteredStock = s;
        }
      )
    })
  }

  deleteStock(item: StockRecursoMaterial) {
    if (item.cantidadDisponible == item.cantidadTotal) {
      this.dialogService.openConfirmDialog("¿Está seguro que lo desea eliminar?").afterClosed().subscribe(res => {
        if (res) {
          this.stockRecursosMaterialesService.delete(item.id).subscribe(s => {
            this.openSnackBar("El Stock fue eliminado correctamente")
            this.stockRecursosMaterialesService.listBy(this.id, this.formGroupStock.value).subscribe(
              s => { this.filteredStock = s }
            )
            this.stockRecursosMaterialesService.list(this.id).subscribe(s => {
              this.stock = s,
              this.HabilitadorCheckbox()
            })
          },
            () => this.openSnackBar("No es posible eliminar stock que ha sido asignado a un recurso o servicio")
          );
        }
      });
    }
    else {
      this.openSnackBar("No es posible eliminar stock que ha sido asignado a un recurso o servicio")
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }

  openSnackBarWithAction(message: string, action: string) {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
    });
    snackBarOpened.onAction().subscribe(() => {
      this.dialogRef.close(true);
    })
  }
}
