import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {Attribute} from "../../../core/services/api/model-details/model-details.interface";
import {filter, takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributesComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() initialData$!: Observable<Attribute[]>;
  public formArray!: FormArray;
  public attributes: Attribute[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createFormControls();
    this.extendParentFormGroup();
    this.initialData$
      .pipe(
        filter((attributes: Attribute[]) => !!attributes),
        tap((attributes: Attribute[]) => this.setInitialData(attributes)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.removeCurrentFormControls();
    this.destroy$.next()
    this.destroy$.unsubscribe()
  }

  addItem(): void {
    this.formArray.markAsDirty();
    this.formArray.push(new FormGroup({}));
  }

  removeItem(index: number): void {
    this.formArray.markAsDirty();
    this.formArray.removeAt(index);
    this.attributes.splice(index, 1);
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.formArray = new FormArray([]);
  }

  private extendParentFormGroup(): void {
    this.parentForm.addControl('attributes', this.formArray);
  }

  private removeCurrentFormControls(): void {
    this.parentForm.removeControl('attributes');
  }

  private setInitialData(attributes: Attribute[]): void {
    this.attributes = attributes;
    this.formArray.clear();
    attributes.forEach(() => this.addItem());
    this.cdr.markForCheck();
  }
}
