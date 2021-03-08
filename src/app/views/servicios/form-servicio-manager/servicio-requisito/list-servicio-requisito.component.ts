import { Component, OnInit } from '@angular/core';
import { Requisito } from 'src/app/core/models/requisito';
import { SharedService } from 'src/app/core/services/shared.service';
import { TipoRecurso } from 'src/app/core/models/tipoRecurso';
import { MatDialog } from '@angular/material/dialog';
import { FormServicioRequisitoComponent } from './form-servicio-requisito.component';
import { RequisitosService } from 'src/app/core/services/requisitos.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-list-servicio-requisito',
  templateUrl: './list-servicio-requisito.component.html'
})
export class ListServicioRequisitoComponent implements OnInit {
  constructor(private sharedService: SharedService, public dialog: MatDialog,
    private confirmService: DialogService,
    private requisitoService: RequisitosService,
    private snackBar: MatSnackBar) { }
  requisitos: Requisito[];
  id: any;
  async ngOnInit() {
    await this.sharedService.currentShare.subscribe(async x => {
      this.id = x
      await this.getRequisitos(x);
    });
  }

  async getRequisitos(_id) {
    if (_id) {
      this.requisitos = await this.requisitoService.list(_id).toPromise();
    }
  }
  applyFilter(e) {

  }

  delete(_id) {
    this.confirmService.openConfirmDialog("¿Está seguro que desea desasignar el recurso al servicio?").afterClosed().subscribe(res => {
      if (res) {
        this.requisitoService.delete(_id).subscribe(async s => {
          await this.getRequisitos(this.id);
          this.openSnackBar("El requisito ha sido eliminado correctamente")
        }, err => {
          this.openSnackBar("El requisito no puede ser eliminado por que tiene Alertas activas")
        })
      }
    });
  }
  onCreate() {
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FormServicioRequisitoComponent, {
      width: '75%',
      data: { idServicio: this.id }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result == true) {
        this.requisitos = await this.requisitoService.list(this.id).toPromise();
      }
    });
  }
  openSnackBar(message: string, action: string = "") {
    let snackBarOpened = this.snackBar.open(message, action, {
      duration: 5000,
      //panelClass : ["bg-white","text-dark"]
    });
  }
}
