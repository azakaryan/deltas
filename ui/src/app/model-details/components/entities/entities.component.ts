// @ts-ignore
import isEqual from 'lodash.isequal';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {filter, takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {Entity} from "../../../core/services/api/model-details/model-details.interface";
import {EntitiesService} from "../../services/entities.service";
import {uniqueCollectionKeyValidator} from "../../../shared/validators/unique-collection-key.validator";
import {ModelDetailsFormService} from "../../services/model-details-form.service";

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitiesComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() initialData$!: Observable<Entity[]>;
  public formArray!: FormArray;
  public entities!: Entity[];
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private entitiesService: EntitiesService,
    private modelDetailsFormService: ModelDetailsFormService,
  ) {
    this.createFormControls();
    this.subscribeOnEntityChanges();
  }

  ngOnInit(): void {
    this.extendParentFormGroup();
    this.initialData$
      .pipe(
        filter((entities: Entity[]) => !!entities),
        tap((entities: Entity[]) => this.setInitialData(entities)),
        takeUntil(this.destroy$),
      )
      .subscribe()
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
    this.entities.splice(index, 1);
    this.formArray.markAsDirty();
    this.formArray.removeAt(index);
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.formArray = new FormArray([], [uniqueCollectionKeyValidator('name')]);
  }

  private extendParentFormGroup(): void {
    this.parentForm.addControl('entities', this.formArray);
  }

  private removeCurrentFormControls(): void {
    this.parentForm.removeControl('entities');
  }

  private setInitialData(entities: Entity[]): void {
    this.entities = entities;
    this.formArray.clear();
    entities.forEach(() => this.addItem());
    if (!entities.length) this.modelDetailsFormService.markIntact();
    this.cdr.markForCheck();
  }

  private subscribeOnEntityChanges(): void {
    this.formArray.valueChanges
      .pipe(
        withLatestFrom(this.entitiesService.getEntityNames()),
        tap(([formData, currentNames]: any) =>
          this.updateEntityNamesIfAnyChanges(currentNames, this.getValidEntityNames(formData))
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getValidEntityNames(entities: Entity[]): string[] {
    return entities.map(({ name }: Entity) => name?.trim()).filter(Boolean);
  }

  private updateEntityNamesIfAnyChanges(oldNames: string[], newNames: string[]): void {
    if (isEqual(oldNames, newNames)) return;

    this.entitiesService.setEntityNames(newNames);
  }
}
