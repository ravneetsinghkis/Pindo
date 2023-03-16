import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[appConfirmMinSingleCheckbox]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ConfirmMinimumSingleSelectedValidatorDirective,
        multi: true
    }]
})
export class ConfirmMinimumSingleSelectedValidatorDirective implements Validator {
    validate(passwordGroup: AbstractControl): { [key: string]: any } | null {       
        const creditCheckbox = passwordGroup.get('paymentCredit');
        const chequeCheckbox = passwordGroup.get('paymentCheque');
        const cashCheckbox = passwordGroup.get('paymentCash');
        if (creditCheckbox && chequeCheckbox && cashCheckbox && !creditCheckbox.value && !chequeCheckbox.value && !cashCheckbox.value){
            // console.log('yes');
            return { 'notEqual': true };
        }

        return null;
    }
// tslint:disable-next-line:eofline
}