import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
interface SelectData {
  key: string;
  value: string;
}
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() placeholderName: string = "";
  @Input() class;
  @Input() data: SelectData[] = [];
  @Input() labelName: string;
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() submitted: boolean = false;
  @Output() changeData: EventEmitter<any> = new EventEmitter<any>();
  selectedText: string = "";
  selectedValue: any;
  filterData: SelectData[];
  get hasError(): boolean {
    if (this.form.get(this.controlName)) {
      return !this.form.get(this.controlName).valid;
    }
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
  get isSubmitted(): boolean {
    return !this.form.get(this.controlName).valid && this.submitted;
  //  return this.submitted;
  }
  constructor(private cdRef:ChangeDetectorRef) { }
  ngAfterViewChecked(): void {
    var control = this.form.get(this.controlName);
    if (control && control.value) {
      var controlVal = this.data.find(s => s.key == control.value)
      if (controlVal) {
        this.selectedValue = control.value;
        this.selectedText = controlVal.value;
      } else {
        this.selectedText = '';
      }
    } else {
      this.selectedText = '';
    }
   }
  ngOnInit() {
    this.class = !this.class ? 'col-lg-6 col-md-8 col-sm-12' : this.class;
    this.filterData = this.data;
  
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
  onSearchChange(data : string) {
    if (!data) {
      this.filterData = this.data;
      this.selectedText = '';
      this.selectedValue = null;
     
    } else {
      this.filterData = this.data.filter(s => s.value.toLowerCase().includes(data.toLowerCase()));     
      this.selectedValue = null;
    }
    var control = this.form.get(this.controlName);
    if (control) {
      control.setValue('');
    }
  }

}
