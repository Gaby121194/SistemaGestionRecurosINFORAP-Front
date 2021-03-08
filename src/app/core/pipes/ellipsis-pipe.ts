import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform  {
    transform(val: { length: number; substring: (arg0: number, arg1: any) => string; }, args: number) {
        if (args === undefined) {
            return val;
        }
        if (val.length > args) {
            return val.substring(0, args) + '...';
        } else {
            return val;
        }
    }
}