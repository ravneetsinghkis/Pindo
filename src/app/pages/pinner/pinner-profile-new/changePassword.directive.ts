import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[checkPaswordMatch]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ChangeCustomValidator,
        multi: true
    }]
})
export class ChangeCustomValidator implements Validator {
    constructor() {
        //console.log('asdasd',this.doerprof.avlList);
    }
    validate(passwordGruop: AbstractControl): { [key: string]: any } | null {       
        let regexPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        let patternValidity = false;
        if (passwordGruop && (passwordGruop.get('password')) && passwordGruop.get('confirmPassword')){         

            const changePassVal = passwordGruop.get('password').value;
            const confirmPassVal = passwordGruop.get('confirmPassword').value;           

            
            if((changePassVal!=confirmPassVal) && (changePassVal!='' && confirmPassVal!='')) {
                let changepassPatterValid = checkPattern(changePassVal);
                let changeConfrmpassPatterValid = checkPattern(confirmPassVal);
                if(!changepassPatterValid){
                    return { 'patternChangePassDoesntMatch': true };
                }
                else if(!changeConfrmpassPatterValid) {
                    return { 'patternConfPassDoesntMatch': true };
                }
                else {}
                return { 'notEqual': true };
            }
            else if(changePassVal=='' && confirmPassVal=='') {
                return { 'bothEmpty': true };
            }
            else if(changePassVal=='' && confirmPassVal!='') {             
                return { 'changePassempty': true };
            }
            else if(confirmPassVal=='' && changePassVal!='') {
                return { 'confirmPassempty': true };
            }            
            else {
                let changepassPatterValid = checkPattern(changePassVal);
                let changeConfrmpassPatterValid = checkPattern(confirmPassVal);
                if(!changepassPatterValid){
                    return { 'patternChangePassDoesntMatch': true };
                }
                else if(!changeConfrmpassPatterValid) {
                    return { 'patternConfPassDoesntMatch': true };
                }
                else
                    return null;
            }
            //return { 'notEqual': true };
        }

        function checkPattern(inputVal) {
            return regexPattern.test(inputVal);
        }
        
    }

    
// tslint:disable-next-line:eofline
}