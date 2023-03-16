import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customeTimeAgo' })
export class CustomeTimeAgoPipe implements PipeTransform {
  transform(d: any): string {
    const currentDate = new Date(new Date().toUTCString());
    const date = new Date(d);
    const year = currentDate.getFullYear() - date.getFullYear();
    const month = currentDate.getMonth() - date.getMonth();
    const day = currentDate.getDate() - date.getDate();
    const hour = currentDate.getHours() - date.getHours();
    const minute = currentDate.getMinutes() - date.getMinutes();
    const second = currentDate.getSeconds() - date.getSeconds();

    // 2592000

    const createdSecond = (year * 31536000) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

    if (createdSecond >= 31536000) {
      const yearAgo = Math.floor(createdSecond / 31536000);
      if (yearAgo === 1) {
        return yearAgo + ' year ago';
      } else {
        return yearAgo + ' years ago';
      }
      //   return yearAgo > 1 ? yearAgo + " y" : yearAgo + " y";
    } else if (createdSecond >= 2592000) {
      const monthAgo = Math.floor(createdSecond / 2592000);
      if (monthAgo === 1) {
        return monthAgo + ' month ago';
      } else {
        return monthAgo + ' months ago';
      }
      //   return monthAgo > 1 ? monthAgo + " m" : monthAgo + " m";
    } else if (createdSecond >= 604800) {
      const weekAgo = Math.floor(createdSecond / 604800);
      if (weekAgo === 1) {
        return weekAgo + ' week ago';
      } else {
        return weekAgo + ' weeks ago';
      }
      //   return dayAgo > 1 ? dayAgo + " d" : dayAgo + " d";
    } else if (createdSecond >= 86400) {
      const dayAgo = Math.floor(createdSecond / 86400);
      if (dayAgo === 1) {
        return dayAgo + ' day ago';
      } else {
        return dayAgo + ' days ago';
      }
      //   return dayAgo > 1 ? dayAgo + " d" : dayAgo + " d";
    } else if (createdSecond >= 3600) {
      const hourAgo = Math.floor(createdSecond / 3600);
      if (hourAgo === 1) {
        return hourAgo + ' hour ago';
      } else {
        return hourAgo + ' hours ago';
      }
      //   return hourAgo > 1 ? hourAgo + " hours ago" : hourAgo + " hour ago";
    } else if (createdSecond >= 60) {
      const minuteAgo = Math.floor(createdSecond / 60);
      // return minuteAgo + "Minutes";
      if (minuteAgo === 1) {
        return minuteAgo + ' minute ago';
      } else {
        return minuteAgo + ' minutes ago';
      }
    } else if (createdSecond < 60) {
      return 'just now';
      // return createdSecond > 1 ? createdSecond + " seconds ago" : createdSecond + " second ago";
    }
    // else if (createdSecond < 0) {
    //   return 'just now';
    //   // return "0 second ago";
    // }
  }
}


// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'customeTimeAgo'
// })
// export class CustomeTimeAgoPipe implements PipeTransform {

//   transform(value: any, args?: any): any {
//     return null;
//   }

// }

// import {Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy} from "@angular/core";
// // import {Translate} from './translate';
// @Pipe({
// 	name:'customeTimeAgo',
// 	pure:false
// })
// export class CustomeTimeAgoPipe implements PipeTransform, OnDestroy {
// 	private timer: number;
// 	// private translate: Translate = new Translate();

// 	constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {}
// 	// transform(value:string) {
// 	transform(value:string) {
// 		this.removeTimer();
// 		let d = new Date(value);
// 		let now = new Date();
//     //    export class TimeAgoPipe implements PipeTransform, OnDestroy {
// 			// }
// 			// return null;
// 		// });

// 		return this.getI18nMessage(seconds, locale || 'en');
// 	}

// 	getI18nMessage(seconds:number, locale: string) {
// 		let minutes = Math.round(Math.abs(seconds / 60));
// 		let hours = Math.round(Math.abs(minutes / 60));
// 		let days = Math.round(Math.abs(hours / 24));
// 		let months = Math.round(Math.abs(days/30.416));
// 		let years = Math.round(Math.abs(days/365));
// 		if (seconds <= 45) {
// 			return 'a few seconds ago';
// 		} else if (seconds <= 90) {
// 			return 'a minute ago';
// 		} else if (minutes <= 45) {
// 			return minutes + ' minutes ago';
// 		} else if (minutes <= 90) {
// 			return 'an hour ago';
// 		} else if (hours <= 22) {
// 			return hours + ' hours ago';
// 		} else if (hours <= 36) {
// 			return 'a day ago';
// 		} else if (days <= 25) {
// 			return days + ' days ago';
// 		} else if (days <= 45) {
// 			return 'a month ago';
// 		} else if (days <= 345) {
// 			return months + ' months ago';
// 		} else if (days <= 545) {
// 			return 'a year ago';
// 		} else { // (days > 545)
// 			return years + ' years ago';
// 		}


//         if (seconds <= 45) {
//             return 'a few seconds ago';
//         } else if (seconds <= 90) {
//             return  'a minute ago';
//         } else if (minutes <= 45) {
//             return 'minutes ago'+ minutes;
//         } else if (minutes <= 90) {
//             return 'an hour ago';
//         } else if (hours <= 22) {
//             return 'hours ago'+ hours ;
//         } else if (hours <= 36) {
//             return 'a day ago';
//         } else if (days <= 25) {
//             return 'days ago'+days;
//         } else if (days <= 45) {
//             return 'a month ago';
//         } else if (days <= 345) {
//             return 'months ago' + months ;
//         } else if (days <= 545) {
//             return 'a year ago';
//         } else { // (days > 545)
//             return 'years ago'+ years ;
//         }
// 	}

// 	ngOnDestroy(): void {
// 		this.removeTimer();
// 	}
