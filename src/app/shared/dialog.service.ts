import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatAlertDialogComponent } from '../components/mat-alert-dialog/mat-alert-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(message){
    return this.dialog.open(MatConfirmDialogComponent,{
      width: '50%',
      height: '40%',
      disableClose: false,
      maxHeight: "200px",
      maxWidth: "400px",
      minHeight: "200px",
      minWidth: "300px",
      panelClass: 'confirm-dialog-container',
      data : { message : message}
    })
  }

  openAlertDialog(msg){
    return this.dialog.open(MatAlertDialogComponent,{
      disableClose: false,
      width: '50%',
      height: '40%',
      maxHeight: "200px",
      maxWidth: "400px",
      minHeight: "200px",
      minWidth: "300px",
      data: {
        message: msg
      }
    })
  }
}
