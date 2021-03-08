import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'upperDate'
})
export class UpperDatePipe extends
  DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, args).toUpperCase();
  }

}
