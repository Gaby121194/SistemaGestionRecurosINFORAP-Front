import { AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms'
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
@Injectable()
export class DateValidator {
  
  constructor(private datePipe: DatePipe) { }

    public mustBeMinor(
        matchTo: string // name of the control to match to
      ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
          return !!control.parent &&
          !!control.parent.value && this.ParseDate(control.value) <= this.ParseDate(control.parent?.controls[matchTo]?.value)  || control.parent?.controls[matchTo]?.value === null 
            ? null
            : { mustBeMinor: true };
        };
    }
    public mustBeMajor(
        matchTo: string // name of the control to match to
      ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {

          return  !!control.parent &&
            !!control.parent.value &&
            this.ParseDate(control.value) >= this.ParseDate(control.parent?.controls[matchTo]?.value)  || control.parent?.controls[matchTo]?.value === null 
            ? null
            : { mustBeMajor: true };
        };
    }
    static ptDate(control: FormControl): { [key: string]: any } {
      let ptDatePattern = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
      if (!control.value) return { "ptDate": true };

      if (!control.value.match(ptDatePattern))
          return { "ptDate": true };

      return null;
  }

  static usDate(control: FormControl): { [key: string]: any } {
      let usDatePattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;
      if (!control.value) return { "ptDate": true };
      if (!control.value.match(usDatePattern))
          return { "usDate": true };

      return null;
  }
    private ParseDate(input: string) {
        if(!input || input.split("-").length!= 3) return '';
         input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
        return new Date(this.datePipe.transform(input,'yyyy-MM-dd'));
      }
}
