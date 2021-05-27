import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export function uniqueSources(sourceKey: string, targetKey: string): ValidatorFn {
  return (group: AbstractControl): any => {
    let source = (<FormGroup>group).controls[sourceKey];
    let target = (<FormGroup>group).controls[targetKey];

    if (source?.value === target?.value) {
      return {
        distinctSourcesError: { message: `${sourceKey} and ${targetKey} should be distinct`},
      };
    }

    return null;
  }
}
