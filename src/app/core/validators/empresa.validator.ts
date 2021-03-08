import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms'
import { Injectable } from '@angular/core';
import { EmpresasService } from '../services/empresas.service';
@Injectable()
export class EmpresaValidator {
    constructor(private basicService: EmpresasService) { }

    validField(control: AbstractControl): ValidationErrors | null {
        if (!control || !control.value) return null;
        return new Promise<ValidationErrors | null>(resolve => {
            let id = '';
            if (control && control.parent && control.parent.controls['id']) {
                id = control.parent.controls['id'].value;
            }
            this.basicService.validateFields(control.value, id).subscribe(r => {
                resolve(r.valid === true ? null : { "validField": true });
            })
        });
    }


    public validateFields(
        id: string = ''// name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control || !control.value) return null;
            return new Promise<ValidationErrors | null>(resolve => {               
                this.basicService.validateFields(control.value, id).subscribe(r => {
                    resolve(r.valid === true ? null : { "validField": true });
                })
            });
        };
    }

}