import {FormControl, FormGroup} from "@angular/forms";

export class FormGroupUtil {
  /**
   * Recursively Marks all controls in a form group as touched and dirty
   */
  public static markTouchedAndDirty(formGroup: FormGroup): void {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      this.markControlTouchedAndDirty(control);

      if (control.controls) this.markTouchedAndDirty(control);
    })
  }

  /**
   * Recursively Marks all controls in a form group as untouched and pristine
   */
  public static markUntouchedAndPristine(formGroup: FormGroup): void {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      this.markControlUntouchedAndPristine(control);

      if (control.controls) this.markUntouchedAndPristine(control);
    })
  }

  public static markControlTouchedAndDirty(formControl: FormControl | FormGroup): void {
    formControl.markAsTouched();
    formControl.markAsDirty();
  }

  public static markControlUntouchedAndPristine(formControl: FormControl | FormGroup): void {
    formControl.markAsUntouched();
    formControl.markAsPristine();
  }
}
