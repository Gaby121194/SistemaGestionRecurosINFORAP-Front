import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
interface SelectData {
  key: string;
  value: string;
  checked: boolean
}

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit, AfterViewInit {
  @Input() placeholderName: string = "";
  @Input() class: string = "col-lg-6 col-md-8 col-sm-12";
  @Input() data: any[] = []
  @Input() all: boolean = true;
  @Input() defaultValue: boolean = false;
  @Output() changeData: EventEmitter<any> = new EventEmitter<any>();
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() submitted: boolean = false;
  expanded = false;
  public innerData: SelectData[];
  selectedText: string = "";
  selectedValue: any;
  clickAllValue: boolean;
  labelName = "";
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
  ngAfterViewInit(): void {
    let controlData = this.getControlData();
    if (controlData) {
      controlData.forEach(s => {
        var item = this.innerData.find(t => t.key == s);
        if (item) {
          item.checked = true;
        }
      })
    }
    this.clickAllValue = this.defaultValue;
  }


  ngOnInit() {
    this.labelName = this.placeholderName;
    this.innerData = this.data.map(s => { return { key: s.key, value: s.value, checked: Boolean(this.defaultValue) } })


  }
  clickAll() {
    this.innerData.forEach(s => s.checked = !this.clickAllValue)
    this.clickAllValue = !this.clickAllValue;
    return this.emit(this.innerData.filter(s => s.checked == true).map(s => s.key));
  }
  onChange(event) {
    let selectedData = this.innerData.filter(s => s.checked == true).map(s => s.key);
    this.clickAllValue = selectedData.length == this.innerData.length;
    this.setControlValue(selectedData);
    return this.emit(selectedData);
  }
  emit(data) {
    this.changeData.emit(data);
  }
  setControlValue(value) {
    let control = this.form.get(this.controlName);
    if (control) {
      control.setValue(value);
    }
  }
  getControlData(): Array<any> {
    let control = this.form.get(this.controlName);
    if (control) {
      return control.value;
    } else return null;
  }
}
