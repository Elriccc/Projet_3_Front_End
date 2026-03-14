import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function passwordExistAndIsTooShort(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        const passwordInvalid = value.length > 0 && value.length < 6;
        return passwordInvalid? {passwordExistAndIsTooShort:true}: null;
    }
}