import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Backup } from 'src/app/core/models/backup';
import { BackupService } from 'src/app/core/services/backup.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DateValidator } from 'src/app/core/validators/date.validator';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-list-backups',
  templateUrl: './list-backups.component.html'
})
export class ListBackupsComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private dateValidator: DateValidator,
    private backupService: BackupService,
    private dialogService: DialogService,
    private datePipe : DatePipe,
    private excelService : ExcelService,
    private snackBar: MatSnackBar) { }
  page = 1;
  hasErrors: boolean;
  submitted = false;
  backupList: Array<Backup>;
  formGroup: FormGroup;

  async ngOnInit(): Promise<void> {
    this.loadFormGroup();
    await this.listBackups();

  }
  restore(key) {
    var date = this.backupList.find(s=>s.id  == key)?.creationDate;
    this.dialogService.openConfirmDialog(`¿Está seguro que desea restaurar el sistema al backup generado el ${this.datePipe.transform(date,"dd-MM-yyyy")} a las ${this.datePipe.transform(date,"HH:mm")}? \n Todos los cambios posteriores se perderán`).afterClosed().subscribe(res => {
      if (res) {
        this.backupService.restore(key).subscribe(async () => {
          await this.listBackups();
          this.openSnackBar("La restauración se ejecutó correctamente")
        }, () => {
          return this.openSnackBar("Ocurrió un error al restaurar la base de datos");
        });
      }
    });
  }
  async onSearch() {
    this.submitted = true;
    if (this.formGroup.valid) {
      await this.listBackups();
    }
  }
  async clear() {
    this.submitted = false;
    this.loadFormGroup();
    await this.listBackups();
  }

  exportToExcel() { 
    if(this.backupList.length > 0){
      let exportdata = this.backupList.map(e => {
        return {
          Fecha: e.creationDate.split("T")[0],
          Nombre: e.name
        }
      })
      this.excelService.exportAsExcelFile(exportdata,'Backups', this.formGroup);
    } else{
      this.openSnackBar("No es posible exportar un listado vacío")
    }

  }



  async listBackups() {
    this.backupList = await this.backupService.listBy(this.formGroup.value).toPromise();
  }

  loadFormGroup() {
    this.formGroup = this.fb.group({
      creationDateFrom: [null, this.dateValidator.mustBeMinor("creationDateTo")],
      creationDateTo: [null, this.dateValidator.mustBeMajor("creationDateFrom")]
    })
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }
}
