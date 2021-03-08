import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'app-mat-alert-dialog',
  templateUrl: './mat-alert-dialog.component.html',
  styleUrls: ['./mat-alert-dialog.component.scss']
})
export class MatAlertDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close(false)
  }
}
