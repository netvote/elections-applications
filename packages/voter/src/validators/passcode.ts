import {AbstractControl} from '@angular/forms';

export class PasscodeValidation {

    static  MatchPasscode(ac: AbstractControl): any {
        if(!ac.parent || !ac) return;

        const pcode = ac.parent.get('passcode');
        const vpcode = ac.parent.get('verifyPasscode')

        if(!pcode || !vpcode) return;
        if (pcode.value !== vpcode.value) {
            return { invalid: true };
        }
    }
}

