import { Injectable } from "@angular/core";
import {FormGroup} from "@angular/forms";
import {FormIntactChecker} from "../../core/utils/form-intact-checker.util";
import {Operation} from "fast-json-patch";

@Injectable()
export class ModelDetailsFormService {
  private form!: FormGroup;
  private formIntactChecker!: FormIntactChecker;

  constructor() {}

  setForm(form: FormGroup): void {
    this.form = form;
    this.formIntactChecker = new FormIntactChecker(this.form);
  }

  markIntact(): void {
    this.formIntactChecker.markIntact();
  }

  getDiff(): Operation[] {
    let deltas: Operation[] = this.formIntactChecker.getDiff();
    // To make sure all 'associations' operations comes at the very end have to rearrange them using filters
    // Note the order of each operation is important thus simple sort may not always work.
    const associationOps = deltas.filter((delta: Operation) => delta.path.includes('associations'));
    const otherOps = deltas.filter((delta: Operation) => !delta.path.includes('associations'));

    return [...otherOps, ...associationOps];
  }
}
