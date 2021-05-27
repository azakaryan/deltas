import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Association} from "../../../core/services/api/model-details/model-details.interface";
import {EntitiesService} from "../../services/entities.service";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {filter, takeUntil, tap} from "rxjs/operators";
import {ModelDetailsFormService} from "../../services/model-details-form.service";

@Component({
  selector: 'app-association-details',
  templateUrl: './association-details.component.html',
  styleUrls: ['./association-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationDetailsComponent implements OnInit {
  @Input() parentForm!: any;
  @Input() set association(association: Association) {
    this.association$.next(association);
  }
  public name!: FormControl;
  public source!: FormControl;
  public target!: FormControl;
  public entityNames$!: Observable<string[]>;
  private destroy$ = new Subject<void>();
  private association$ = new ReplaySubject<Association>(1);

  constructor(
    private cdr: ChangeDetectorRef,
    private modelDetailsFormService: ModelDetailsFormService,
    private entitiesService: EntitiesService,
  ) {
    this.createFormControls();
  }

  ngOnInit(): void {
    this.extendParentFormGroup(<FormGroup>this.parentForm);

    this.entityNames$ = this.entitiesService.getEntityNames()
      .pipe(
        tap((names: string[]) => {
          if (this.source.value && !names.includes(this.source.value)) this.source.reset();
          if (this.target.value && !names.includes(this.target.value)) this.target.reset();
        })
      );

    this.association$
      .pipe(
        filter((association: Association) => !!association),
        tap((association: Association) => this.updateData(association)),
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
    this.name = new FormControl(null, [Validators.required]);
    this.source = new FormControl(null);
    this.target = new FormControl(null);
  }

  private extendParentFormGroup(parentForm: FormGroup): void {
    parentForm.addControl('name', this.name);
    parentForm.addControl('source', this.source);
    parentForm.addControl('target', this.target);
  }

  private updateData(association: Association): void {
    this.parentForm.patchValue(association);
    this.modelDetailsFormService.markIntact();
    this.cdr.markForCheck();
  }
}
