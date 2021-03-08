import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms'
import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
@Injectable()
export class ServicioValidator {
    constructor(private basicService: ServiciosService) { }

    validField(control: AbstractControl): ValidationErrors | null {
        if (!control || !control.value) return null;
        return new Promise<ValidationErrors | null>(resolve => {
            let id = '';
            if (control && control.parent && control.parent.controls['id']) {
                id = control.parent.controls['id'].value;
            }
            this.basicService.validateUniqueFields(control.value, id).subscribe(r => {
                resolve(r.valid === true ? null : { "validField": false });
            })
        });
    }


    public validateFields(
        id: string = ''// name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control || !control.value) return null;
            return new Promise<ValidationErrors | null>(resolve => {               
                this.basicService.validateUniqueFields(control.value, id).subscribe(r => {
                    resolve(r.valid === true ? null : { "validField": false });
                });
            });
        };
    }


}