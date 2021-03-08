import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss']
})
export class ShowErrorsComponent {
  errorMessages: any;

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  @Input() shouldShowManualErrors: boolean;

  @Input() type: string;

  @Input() fieldMessage: string;

  constructor(private translate: TranslateService) {
    this.errorMessages = {
      'rangedate': () => translate.instant('errorMessages.rangedate'),
      'matDatepickerParse': () => translate.instant('errorMessages.matDatepickerParse'),
      'dateValidator': () => translate.instant('errorMessages.dateValidator'),
      'emailAlreadyExist': () => translate.instant('errorMessages.emailAlreadyExist'),
      'AnalystExist': () => translate.instant('errorMessages.AnalystExist'),
      'required': () => translate.instant('errorMessages.required'),
      'fieldExistent': () => translate.instant('errorMessages.existent', { field: this.fieldMessage }),
      'email': () => translate.instant('errorMessages.email'),
      'number': () => translate.instant('errorMessages.number'),
      'invalid': () => translate.instant('errorMessages.invalid'),
      'DateDoesntHaveBetaType': () => translate.instant('errorMessages.DateDoesntHaveBetaType'),
      'atLeastOneCheckboxChecked': () => translate.instant('errorMessages.atLeastOneCheckboxChecked'),
      // 'minlength': (params: { requiredLength: any; }) => `Este campo debe tener al menos ${params.requiredLength} caracteres`,
      // 'maxlength': (params: { requiredLength: any; }) => `Este campo debe tener como máximo ${params.requiredLength} caracteres`,
      'pattern': (params) => translate.instant('errorMessages.pattern'),
      'years': (params) => params.message,
      'countryCity': (params) => params.message,
      'uniqueName': (params) => params.message,
      'telephoneNumbers': (params) => params.message,
      'telephoneNumber': (params) => params.message,
      'ngbDate': () => '',
      'atLeast14Values': () => '',
      'atLeastOneFloatingPaymentRow': () => translate.instant('errorMessages.atLeastOneFloatingPaymentRow')
    };
  }
  shouldShowErrors(): boolean {
    return this.control && this.control.errors && (this.control.dirty || this.control.touched || this.control.pristine);
  }

  listOfErrors(): string[] {

    return this.control ? Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field])) : [this.getMessage('', {})];

  }

  private getMessage(type: string, params: any) {
    return this.control ? this.errorMessages[type](params) : this.errorMessages[this.type](params);
  }
}
