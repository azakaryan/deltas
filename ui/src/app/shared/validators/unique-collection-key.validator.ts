import {AbstractControl, FormArray, ValidatorFn} from '@angular/forms';

export function uniqueCollectionKeyValidator(keyName: string): ValidatorFn {
  return (formArray: AbstractControl): any => {
    const names: string[] = (<FormArray>formArray).controls.map((formGroup: AbstractControl) => formGroup.get(keyName)?.value);

    if (new Set(names).size !== names.length) {
      return {
        uniqueCollectionKeyError: { message: `Duplicate ${keyName}'s found`},
      };
    }

    return null;
  }
}
