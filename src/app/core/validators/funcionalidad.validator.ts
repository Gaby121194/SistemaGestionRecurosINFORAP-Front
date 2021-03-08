import { AbstractControl, ValidationErrors } from '@angular/forms'
import { Injectable } from '@angular/core';
import { FuncionalidadService } from '../services/funcionalidad.service';
@Injectable()
export class FuncionalidadValidator {

    constructor(private basicService: FuncionalidadService) { }

    validField(control: AbstractControl): ValidationErrors | null {
        if (!control || !control.value) return null;
        return new Promise<ValidationErrors | null>(resolve => {
            let id = '';
            let controlName : string ;
            if (control && control.parent) {
                if (control.parent.controls['id']) {
                    id = control.parent.controls['id'].value;
                }
               controlName =  (Object.keys(control.parent.controls).find(key => control.parent.controls[key] === control));
            }else{
                return null;
            }
            this.basicService.validateFields(controlName, control.value, id).subscribe(r => {
                resolve(r.valid === true ? null : { "validField": true });
            })
        });
    }


    public validateFields(
        id: string = ''// name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control || !control.value || !control.parent) return null;
            const controlName = (Object.keys(control.parent.controls).find(key => control.parent.controls[key] === control));

            return new Promise<ValidationErrors | null>(resolve => {
                this.basicService.validateFields(controlName, control.value, id).subscribe(r => {
                    resolve(r.valid === true ? null : { "validField": true });
                })
            });
        };
    }


}
