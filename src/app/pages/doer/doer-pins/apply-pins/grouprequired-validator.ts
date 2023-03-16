import {  ValidatorFn, AbstractControl } from "@angular/forms";

export const myValidator = (field1, field2): ValidatorFn => (control: AbstractControl) => {
	if(control.parent) {
		const firstFieldVal = control.get(field1).value;
		const secondFieldVal = control.get(field2).value;		
		let tempToreturnVal:Object;

		if (firstFieldVal!='' && secondFieldVal==null) {
			tempToreturnVal = { secondFieldEmpty: { valid: false } }
		} else if(secondFieldVal!=null && firstFieldVal=='') {
			tempToreturnVal = { firstFieldEmpty: { valid: false } }
		} else {
			tempToreturnVal = null;
		}
				
		return tempToreturnVal;
  	}
}
