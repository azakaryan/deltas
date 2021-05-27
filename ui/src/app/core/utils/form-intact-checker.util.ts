/*
 * This helper Class is Intended to be used with Angular FormGroups
 * It helps to keep track whether FormGroup element data changed or are intact for current moment
 * In addition it helps you get the diff patch.
 */

// @ts-ignore
import isEqual from 'lodash.isequal';
import { FormGroup } from '@angular/forms';
import {FormGroupUtil} from './form-group.util';
import {compare, deepClone, Operation} from 'fast-json-patch';

export class FormIntactChecker {
  private originalValue!: object;

  constructor(private form: FormGroup) {
    // Every time the form changes, we compare it with the original value.
    // If it is the same we mark the form as pristine again.
    this.form.valueChanges.subscribe(() => {

      if (this.form.dirty) {
        const currentValue = this.getCurrentValue();

        if (isEqual(this.originalValue, currentValue)) {
          FormGroupUtil.markUntouchedAndPristine(this.form);
        }
      }
    })
  }

  // This method can be call to make the current values of the
  // form, the new "original" values.
  // From now on, the new values are to be considered the original values
  public markIntact(): void {
    this.setOriginalValue(this.getCurrentValue())
    FormGroupUtil.markUntouchedAndPristine(this.form);
  }

  // Compares object trees originalValue and currentValue and returns the difference relative to originalValue
  // as a patches array.
  public getDiff(): Operation[] {
    return compare(this.originalValue, this.getCurrentValue());
  }

  /*
   * Private Methods
   */
  private setOriginalValue(value: object): void {
    this.originalValue = deepClone(value);
  }

  private getCurrentValue(): any {
    return this.form.value;
  }
}
