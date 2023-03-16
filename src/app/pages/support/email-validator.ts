import {  ValidatorFn, AbstractControl } from "@angular/forms";


export const myValidator = (field1, field2): ValidatorFn => (control: AbstractControl) => {
	if(control.parent) {
		let email = control['controls'][field1];
		let confirmEmail = control['controls'][field2];
		if(email['valid'] && confirmEmail['valid']) {
			const isValid = (email['value'] !== confirmEmail['value']) ? { myValidator: { valid: false } } : null;			
			return isValid;
		}
		return null; 
  	}
}
