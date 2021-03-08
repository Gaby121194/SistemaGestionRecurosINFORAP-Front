import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.scss']
})
export class MatConfirmDialogComponent implements OnInit {
  mensaje : string;

  constructor(public dialogRef: MatDialogRef<MatConfirmDialogComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { 
      this.mensaje = data.message
    }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close(false)
  }
}
