import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetransform'
})
export class DatetransformPipe implements PipeTransform {

  transform(date: any): any {
    console.log('DATE PIPE', date);
    const year = date.substring(0, 4);
    const newdate = date.substring(5, 10) + '-' + year;
    return 'Received ' + newdate;
  }

}
