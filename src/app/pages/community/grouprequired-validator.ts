import {
	ValidatorFn,
	AbstractControl
} from "@angular/forms";


export const wordCountlimit = (control:AbstractControl) =>{

	const controlVal = control.value;

	if(controlVal != ''){

		var regex = /\s+/gi;
        var wordCount = controlVal.trim().replace(regex, ' ').split(' ').length;
		console.log(wordCount);
		if(wordCount > 10){
			return {maxlimitCross: true};	
		}
		else{
			return null;
		}
	
	} else {
		return null;
	}

}


// export const ageValidator = (field1, field2): ValidatorFn => (control: AbstractControl) => {
// 	if (control.parent) {
// 		const firstFieldVal = control.get(field1).value;
// 		const secondFieldVal = control.get(field2).value;
// 		let tempToreturnVal: Object;


		
// 		if(firstFieldVal == null && secondFieldVal == null) {
// 			tempToreturnVal = {
// 				bothEmpty: {
// 					valid: false
// 				}
// 			}
// 		}
// 	  if (firstFieldVal != null && secondFieldVal == null) {
// 			tempToreturnVal = {
// 				secondFieldEmpty: {
// 					valid: false
// 				}
// 			}
// 		} else if (secondFieldVal != null && firstFieldVal == null) {
// 			tempToreturnVal = {
// 				firstFieldEmpty: {
// 					valid: false
// 				}
// 			}
// 		} else if (firstFieldVal != null && secondFieldVal != null && firstFieldVal >= secondFieldVal) {
// 			tempToreturnVal = {
// 				firstFieldLgValue: {
// 					valid: false
// 				}
// 			}
// 		} else {
// 			tempToreturnVal = null;
// 		}
// 		return tempToreturnVal;
// 	}
// }


// export const expDateValidator = (control: AbstractControl) => {

// 	const controlVal = control.value;
// 	var expMonth = 0;
// 	var expYear = 0;
// 	if (controlVal != '') {
// 		expMonth = parseInt(controlVal.substring(0, 2));
// 		expYear = parseInt(controlVal.substring(2, 6));
// 	}


// 	let currentYear = new Date().getFullYear();
// 	let currentMonth = new Date().getMonth() + 1;

// 	if(controlVal != ''){
// 		if ((currentYear > expYear)) {
			
// 			return {
// 				validExpDate: true
// 			};
// 		}
// 		else if (currentYear == expYear) {			
// 			if (currentMonth >= expMonth) {
				
// 				return {
// 					validExpDate: true
// 				};
// 			}
// 		} else {
// 			return null;
// 		}	
// 	} else {
// 		return null;
// 	}

// }

