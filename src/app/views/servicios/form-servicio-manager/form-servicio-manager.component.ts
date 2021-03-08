import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-servicio-manager',
  templateUrl: './form-servicio-manager.component.html'
})
export class FormServicioManagerComponent implements OnInit {

  constructor(
    private activateRoute: ActivatedRoute,
    private route: Router,
    public dialogRef: MatDialogRef<FormServicioManagerComponent>,
    private sharedService : SharedService) { }
  steps: any[];
  activeStep: number;
  id: number;
  ngOnInit(): void {
    this.sharedService.currentShare.subscribe(x => this.id=x);

    // var _id = Number(this.activateRoute.snapshot.paramMap.get("id"));
    // if(_id){
    //   this.sharedService.set(_id);
    //   this.sharedService.get().subscribe(x=>this.id = x);
    // }else{
    //   this.sharedService.set(0);
    // }

    this.sharedService.set(0);
    this.initSteps();
  }
  initSteps() {
    this.activeStep = 0;
    this.steps = [
      { text: 'Datos del servicio', active: true },
      { text: 'Requisitos', active: false },
      { text: 'Recursos', active: false },
    ]
  }
  goToStep(index: number) {  
    if(this.id){
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
