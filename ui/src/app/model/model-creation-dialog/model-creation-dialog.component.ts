import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {trimValidator} from "../../shared/validators/trim.validator";

@Component({
  selector: 'app-model-creation-dialog',
  templateUrl: './model-creation-dialog.component.html',
  styleUrls: ['./model-creation-dialog.component.scss']
})
export class ModelCreationDialogComponent {
  public form!: FormGroup;
  public name!: FormControl;

  constructor(public dialogRef: MatDialogRef<ModelCreationDialogComponent>) {
    this.createFormControls();
    this.createForm();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  create(): void {
    this.dialogRef.close(this.name);
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.name = new FormControl(null, [trimValidator, Validators.required]);
  }

  private createForm(): void {
    this.form = new FormGroup({ name: this.name });
  }
}
