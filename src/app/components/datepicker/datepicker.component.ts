import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter'
import { NgbDatepickerI18n, NgbDateAdapter, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n, CustomAdapter, CustomDateParserFormatter } from 'src/app/core/helpers/ngb.calendar';
export let MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [
    I18n, 
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ] // define custom NgbDatepickerI18n provider
})
export class DatepickerComponent implements OnInit,AfterViewChecked {
  @Input() asyncMethod: BehaviorSubject<boolean>;
  @Input() readonly: boolean = false;
  @Input() placeholderName: string ="DD-MM-YYYY";
  @Input() labelName: string ="";
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() class: string ="col-lg-6 col-md-8 col-sm-12";
  @Input() submitted: any=false;
  @Input() data: any;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  initialized: boolean = false;
  date: {year: number, month: number};
  @Input() hasError : boolean = false;
  errorMessage: string = "La fecha ingresada no es valida"
  @Input() errorDate : string = ""
  get isSubmitted(): boolean {
    return !this.form.get(this.controlName).valid && this.submitted;
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private cd : ChangeDetectorRef ) { }
  ngOnInit() {
  }
  ngAfterViewChecked(): void {
   
  }
  get required() {
    let abstractControl: AbstractControl = this.form.controls[this.controlName];
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;    
  }
  onChange(event) {
    console.log(this.form.get(this.controlName).errors)
    this.hasError = !this.form.get(this.controlName).valid;

    this.dataChange.emit(this.data)
    this.cd.detectChanges();

    if(this.errorDate.length > 0){
      this.errorMessage = this.errorDate;
    } else if(this.form.get(this.controlName).errors?.mustBeMajor){
      this.errorMessage = "La fecha 'hasta' debe ser mayor a la fecha 'desde'";
    } else if(this.form.get(this.controlName).errors?.mustBeMinor){
      this.errorMessage = "La fecha 'desde' debe ser menor a la fecha 'hasta'";
    }


    // if(this.form.get(this.controlName).errors?.mustBeMinor){
    //   this.errorMessage = "La fecha debe ser menor a la fecha hasta"
    // }   
    // else if(this.form.get(this.controlName).errors?.mustBeMinor){
    //   this.errorMessage = "La fecha debe ser mayor a la fecha desde"
    // }

    return;
  }
  detectChanges(){
    this.cd.detectChanges();
  }
 
}