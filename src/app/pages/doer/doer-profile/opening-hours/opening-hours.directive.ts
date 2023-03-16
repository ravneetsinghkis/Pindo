import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
	selector: '[appCompareTime]',
	providers: [{
		provide: NG_VALIDATORS,
		useExisting: CompareTime,
		multi: true
	}]
})
export class CompareTime implements Validator {
	validate(timeGruop: AbstractControl): { [key: string]: any } | null {
		if (timeGruop) {
			const tempObj = timeGruop.value;
			const timeArr = [];
			for (const property in tempObj) {
				if (tempObj.hasOwnProperty(property)) {
					if (typeof (tempObj[property]) != 'undefined') {
						timeArr.push(tempObj[property]);
					}
				}
			}

			if (timeArr[0] != '' && timeArr[1] != '' && timeArr[2] != '' && timeArr[3] != '' && timeArr.length > 0 && timeArr[0] != null && timeArr[1] != null && timeArr[2] != null && timeArr[3] != null) {
				const starttimetotal = `${timeArr[0]} ${timeArr[1]}`;
				const endtimetotal = `${timeArr[2]} ${timeArr[3]}`;
				const chekdVal = this.compareTime(starttimetotal, endtimetotal);
				if (chekdVal == -1) {
					console.log(chekdVal);
					return { 'notEqual': true };
				}
			}
		}
		return null;
	}

	compareTime(str1, str2) {
		console.log('completime', str1, str2);
		const start_time = str1.split(' ');
		const start_AMPM = start_time[1];
		let start_hrs = start_time[0].split(':')[0];
		const start_mins = start_time[0].split(':')[1];

		const end_time = str2.split(' ');
		const end_AMPM = end_time[1];
		let end_hrs = end_time[0].split(':')[0];
		const end_mins = end_time[0].split(':')[1];
		if (start_AMPM != 'AM' && start_AMPM != 'am') {
			if (start_hrs == 12) {
				start_hrs = 0;
			} else {
				start_hrs = parseInt(start_hrs) + 12;
			}
		} else {
			if (start_hrs == 12) {
				start_hrs = 0;
			}
		}
		if (end_AMPM != 'AM' && end_AMPM != 'am') {
			if (end_hrs == 12) {
				end_hrs = 0;
			} else {
				end_hrs = parseInt(end_hrs) + 12;
			}
		} else {
			if (end_hrs == 12) {
				end_hrs = 0;
			}
		}
		console.log(start_hrs);
		const currentD = new Date();
		const startHappyHourD = new Date();
		startHappyHourD.setHours(start_hrs, start_mins, 0);
		const endHappyHourD = new Date();
		endHappyHourD.setHours(end_hrs, end_mins, 0);

		const totalstrtmins = parseInt(start_hrs) * 60 + parseInt(start_mins);
		const endMins = parseInt(end_hrs) * 60 + parseInt(end_mins);

		console.log('total_calc', totalstrtmins, endMins);

		if (totalstrtmins >= endMins) {
			return -1;
		} else {
			return 1;
		}

	}
	// tslint:disable-next-line:eofline
}