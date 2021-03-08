import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-form-manager-recursosmateriales',
  templateUrl: './form-manager-recursosmateriales.component.html'
})
export class FormManagerRecursosmaterialesComponent implements OnInit {

  steps: any[];
  activeStep: number;
  idRecurso: number;

  constructor(
    public dialogRef: MatDialogRef<FormManagerRecursosmaterialesComponent>,
    private sharedService : SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentShare.subscribe(x => this.idRecurso = x);

    this.sharedService.set(0);
    this.initSteps();
  }

  initSteps() {
    this.activeStep = 0;
    this.steps = [
      { text: 'Datos del recurso', active: true },
      { text: 'Stock', active: false },
    ]
  }

  goToStep(index: number) {  
    if (this.idRecurso){
      this.steps.forEach(s => s.active = false);
      this.steps[index].active = true;
      this.activeStep = index;
    }

  }

  afterFinishServiceCreation(){
    this.goToStep(1);
  }

  close(){
    this.dialogRef.close(true);
  }
}
