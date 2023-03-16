import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortPipe'
})
export class SortPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
  	//console.log('frompipe',value);
  	let tempArr = value.sort((a,b) => {
  		if (a[args] < b[args]) {  			
		    return -1;
		} else if (a[args] > b[args]) {			
		    return 1;
		} else {			
		    return 0;
		}
  	});
  	
    return tempArr;
  }

}
