 import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
@Injectable()
export class DateHelper {
    constructor(private datePipe: DatePipe){}
    public ParseDate(input: any) {
        if (!input || input.split("-").length != 3) return '';
        input = input.split("-")[2] + "/" + input.split("-")[1] + "/" + input.split("-")[0]
        return new Date(this.datePipe.transform(input, 'yyyy-MM-dd'));
    }

    public  ParseDateToString(input: string, separator = "-") {
        if(!input || input.split(separator).length!= 3) return '';
         input = input.split(separator)[2] + "/" +  input.split(separator)[1] + "/" + input.split(separator)[0]
        return this.datePipe.transform(input,'yyyy-MM-dd');
      }
}