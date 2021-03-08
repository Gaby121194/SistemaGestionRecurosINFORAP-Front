import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html'
})
export class TextBoxComponent implements OnInit {
  @Input() asyncMethod: BehaviorSubject<boolean>;
  @Input() readonly: boolean = false;
  @Input() labelName: string;
  @Input() placeholderName: string;
  @Input() controlName: string;
  @Input() tip: string;
  @Input() type: string  ="";
  @Input() class: string;
  @Input() data: any;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() form: FormGroup;
  @Input() submitted: boolean = false;
  @Input() icon: string | null = null;
  @Input() iconMessage: string = "";
  @Output() iconClickEvent: EventEmitter<any> = new EventEmitter<any>();
  initialized: boolean = false;
  constructor() { }
  hasError: boolean;
  @Output() cambioHasError = new EventEmitter<boolean>()
  errorMessage: string;
  @Input() errorPattern: string = "El valor ingresado no es válido​"

  get isSubmitted(): boolean {
    return !this.form.get(this.controlName).valid && this.submitted;
  }
 
  ngOnInit() {
    this.class = !this.class ? 'col-lg-6 col-md-8 col-sm-12' : this.class;
    this.initialized = true;
  }
  ngAfterViewInit() {

  }
  get required() : boolean {
    let abstractControl: AbstractControl = this.form.controls[this.controlName];
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required ) {       
        return true;
      }
    }
    return false;
  }
  onChange() {
    this.hasError = !this.form.get(this.controlName).valid;
  
    if (this.form.get(this.controlName).errors?.required){
      this.errorMessage = "Este campo es requerido"

    }else if (this.form.get(this.controlName).errors?.email){
      this.errorMessage = "El valor ingresado no es un email válido​"

    } else if(this.form.get(this.controlName).errors?.max){
      this.errorMessage = "El valor ingresado debe ser menor a " +  this.form.get(this.controlName).errors?.max.max

    } else if(this.form.get(this.controlName).errors?.min){
      this.errorMessage = "El valor ingresado debe ser mayor a " + this.form.get(this.controlName).errors?.min.min

    } else if (this.form.get(this.controlName).errors?.validField){
      this.errorMessage = "El valor ingresado ya se encuentra registrado"

    } else if (this.form.get(this.controlName).errors?.isMatching){
      this.errorMessage = "Las contraseñas no coinciden "

    }else if (this.form.get(this.controlName).errors?.validUsername){
      this.errorMessage = "El email ingresado ya esta registrado "
    }
    else if(this.form.get(this.controlName).errors?.minlength){
      this.errorMessage = "El valor ingresado es demasiado corto "
    }
    else if(this.form.get(this.controlName).errors?.maxlength){
      this.errorMessage = "El valor ingresado es demasiado largo "
    }
    else if (this.form.get(this.controlName).errors?.pattern){
      this.errorMessage = this.errorPattern

    }


    return;
  }
  async onIconClick(event){    
   await this.iconClickEvent.emit();
   this.hasError = false;
   }
}
