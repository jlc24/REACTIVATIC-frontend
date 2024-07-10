import { FormGroup } from '@angular/forms';

export const RUTA = 'http://localhost:8678/reactivaticapp';
// export const RUTA = 'https://desarrolla.oruro.gob.bo:8443/mipymesapp';
export const TOKEN = 'access_token';
export const TOKEN_USUARIO = 'reactivaticapp';
// export const TOKEN_USUARIO = 'mipymesapp';
export const TOKEN_PASSWORD = 'djEA45d%2er';
export const ROLES = 'ROLES';
export const NOMBRE = 'NOMBRE';
export const NOMBRECLIENTE = 'NOMBRECLIENTE';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
