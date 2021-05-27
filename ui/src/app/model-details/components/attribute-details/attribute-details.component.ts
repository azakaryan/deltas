import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ReplaySubject, Subject} from "rxjs";
import {Attribute} from "../../../core/services/api/model-details/model-details.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {trimValidator} from "../../../shared/validators/trim.validator";
import {filter, takeUntil, tap} from "rxjs/operators";
import {ModelDetailsFormService} from "../../services/model-details-form.service";

@Component({
  selector: 'app-attribute-details',
  templateUrl: './attribute-details.component.html',
  styleUrls: ['./attribute-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeDetailsComponent implements OnInit {
  @Input() parentForm!: any;
  @Input() set attribute(attribute: Attribute) {
    this.attribute$.next(attribute);
  }
  public name!: FormControl;
  public type!: FormControl;
  private destroy$ = new Subject<void>();
  private attribute$ = new ReplaySubject<Attribute>(1)

  constructor(
    private cdr: ChangeDetectorRef,
    private modelDetailsFormService: ModelDetailsFormService,
  ) { }

  ngOnInit(): void {
    this.createFormControls();
    this.extendParentFormGroup(<FormGroup>this.parentForm);
    this.attribute$
      .pipe(
        filter((attribute: Attribute) => !!attribute),
        tap((attribute: Attribute) => this.updateData(attribute)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.unsubscribe()
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.name = new FormControl(null, [trimValidator, Validators.required]);
    this.type = new FormControl(null, [trimValidator, Validators.required]);
  }

  private extendParentFormGroup(parentForm: FormGroup): void {
    parentForm.addControl('name', this.name);
    parentForm.addControl('type', this.type);
  }

  private updateData(attribute: Attribute): void {
    this.parentForm.patchValue(attribute);
    this.modelDetailsFormService.markIntact();
    this.cdr.markForCheck();
  }
}
