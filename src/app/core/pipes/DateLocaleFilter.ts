import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
@Pipe({ name: 'dateLocale', pure: false })
export class DateLocaleFilter implements PipeTransform {
    constructor(public translate: TranslateService) { }
    transform(value: string, dateFormat: string): any {
        if (!this.translate.currentLang) {
            let lang = this.translate.defaultLang
        }
        let lang = this.translate.currentLang
        if (!value) {
            return ''
        }
        moment.locale(lang)
        const dateLocale = moment.utc(value)
        return dateLocale.format(dateFormat)
    }
}