import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms'
import { UsuariosService } from '../services/usuarios.service';
import { Injectable } from '@angular/core';
@Injectable()
export class UserValidator {
    constructor(    private userService: UsuariosService) { }

    validUsername(control: AbstractControl): ValidationErrors | null {
        if (!control || !control.value) return null;
        return new Promise<ValidationErrors | null>(resolve => {
            this.userService.validateUsername(control.value).subscribe(r => {
                resolve(r.valid === true ? null : { "validUsername": true });
            })
        });
    }
    public matchValues(
        matchTo: string // name of the control to match to
      ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
          return !!control.parent &&
            !!control.parent.value &&
            control.value === control.parent.controls[matchTo].value
            ? null
            : { isMatching: true };
        };
    }
}

// import { Directive } from '@angular/core';
// import { AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
// import 'rxjs/add/operator/map';
// import { UsuariosService } from '../services/usuarios.service';
// import { Observable } from 'rxjs';

// @Directive({
//   selector: '[validUSername][formControlName],[validUSername][formControl],[validUSername][ngModel]',
//   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UserValidatorDirective, multi: true}]
// })
// export class UserValidatorDirective implements AsyncValidator {
//   constructor(private userService: UsuariosService) {  }

//   validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
//               return new Promise<ValidationErrors | null> (resolve => {
//             this.userService.validateUsername(control.value).subscribe(r=>{
//                 //  if(r && r.valid == true) {
//                 //      control.errors["validateUsername"] = null
//                 //  }
//                 // else
//                 resolve(r.valid ==true ? null : {"validUsername" : false});
//             })
//         });    
//   }
// } 

// import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { UsuariosService } from '../services/usuarios.service';

// export function isValidUsername(userService: UsuariosService): AsyncValidatorFn {
//   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//                   return new Promise<ValidationErrors | null> (resolve => {
//             userService.validateUsername(control.value).subscribe(r=>{
//                 console.log(r)
//                 resolve(r.valid ==true ? null : {"validUsername" : false});
//             })
//         });    
//   };
// } 