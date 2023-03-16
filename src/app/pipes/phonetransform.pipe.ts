import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phonetransform'
})
export class PhonetransformPipe implements PipeTransform {

  transform(d: any): string {
    let str;
    if (d) {
      str = '(' + d.substring(0, 3) + ') ' + d.substring(3, 6) + '-' + d.substring(6);
    }
    return str;
  }
}
