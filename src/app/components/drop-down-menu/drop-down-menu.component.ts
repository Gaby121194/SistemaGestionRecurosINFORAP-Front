import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
interface SelectData {
  key: string;
  value: string;
}

@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.component.html'
})
export class DropDownMenuComponent implements OnInit, AfterViewChecked {
  @Input() placeholderName: string = "";
  @Input() class;
  @Input() data: SelectData[] = [];
  @Input() labelName: string;
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() disabled: boolean = true;
  @Input() submitted: boolean = false;
  @Output() changeData: EventEmitter<any> = new EventEmitter<any>();
  selectedText: string = "";
  selectedValue: any;
  get hasError(): boolean {
    if (this.form.get(this.controlName)) {
      return !this.form.get(this.controlName).valid;
    }
  }
  get isSubmitted(): boolean {
    //return !this.form.get(this.controlName).valid && this.submitted;
   return this.submitted;
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
  constructor() { }
  ngAfterViewChecked(): void {
    var control = this.form.get(this.controlName);
    if (control && control.value) {
      var controlVal = this.data.find(s => s.key == control.value)
      if (controlVal) {
        this.selectedValue = control.value;
        this.selectedText = controlVal.value;
      } else {
        this.selectedText = this.placeholderName;
      }
    } else {
      this.selectedText = this.placeholderName;
    }
  }
  ngOnInit() {
    this.class = !this.class ? 'col-lg-6 col-md-8 col-sm-12' : this.class;
  
  }
  onChange(value, text) {
    var control = this.form.get(this.controlName);
    if (control) {
      control.setValue(value);
    }
    this.selectedText = text;
    this.selectedValue = value;
    this.changeData.emit(value);
  }
}
