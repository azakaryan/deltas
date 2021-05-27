import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {Association} from "../../../core/services/api/model-details/model-details.interface";
import {filter, map, takeUntil, tap} from "rxjs/operators";
import {uniqueSources} from "../../../shared/validators/unique-sources.validator";
import {EntitiesService} from "../../services/entities.service";
import {uniqueCollectionKeyValidator} from "../../../shared/validators/unique-collection-key.validator";
import {ModelDetailsFormService} from "../../services/model-details-form.service";

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationsComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  @Input() initialData$!: Observable<Association[]>;
  public formArray!: FormArray;
  public canAdd$!: Observable<boolean>;
  public associations!: Association[];
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private entitiesService: EntitiesService,
    private modelDetailsFormService: ModelDetailsFormService,
  ) {
    this.createFormControls();
  }

  ngOnInit(): void {
    this.extendParentFormGroup();
    this.canAdd$ = this.entitiesService.getEntityNames()
      .pipe(
        map((names:  string[]) => names.length > 1)
      )

    this.initialData$
      .pipe(
        filter((associations: Association[]) => !!associations),
        tap((associations: Association[]) => this.setInitialData(associations)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.removeCurrentFormControls();
    this.destroy$.next()
    this.destroy$.unsubscribe()
  }

  public addItem(): void {
    this.formArray.markAsDirty();
    this.formArray.push(this.createControl());
  }

  public removeItem(index: number): void {
    this.formArray.markAsDirty();
    this.formArray.removeAt(index);
    this.associations.splice(index, 1);
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.formArray = new FormArray([], [uniqueCollectionKeyValidator('name')]);
  }

  private extendParentFormGroup(): void {
    this.parentForm.addControl('associations', this.formArray);
  }

  private removeCurrentFormControls(): void {
    this.parentForm.removeControl('associations');
  }

  private setInitialData(associations: Association[]): void {
    this.associations = associations;
    this.formArray.clear();
    associations.forEach(() => this.addItem());
    if (!associations.length) this.modelDetailsFormService.markIntact();
    this.cdr.markForCheck();
  }

  private createControl(): FormGroup {
    // Use custom validator to make sure source and target are unique.
    return new FormGroup({}, [uniqueSources('source', 'target')]);
  }
}
