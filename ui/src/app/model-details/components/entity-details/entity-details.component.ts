import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Attribute, Entity} from "../../../core/services/api/model-details/model-details.interface";
import {Observable, ReplaySubject} from "rxjs";
import {filter, pluck, tap} from "rxjs/operators";
import {trimValidator} from "../../../shared/validators/trim.validator";
import {ModelDetailsFormService} from "../../services/model-details-form.service";

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDetailsComponent implements OnInit {
  @Input() parentForm!: any;
  @Input() set entity(entity: Entity) {
    this.entity$.next(entity);
  }
  public name!: FormControl;
  public attributes$!: Observable<Attribute[]>;
  private entity$ = new ReplaySubject<Entity>(1);

  constructor(
    private cdr: ChangeDetectorRef,
    private modelDetailsFormService: ModelDetailsFormService,
  ) { }

  ngOnInit(): void {
    this.createFormControls();
    this.extendParentFormGroup(<FormGroup>this.parentForm);
    this.attributes$ = this.entity$
      .pipe(
        filter((entity: Entity) => !!entity),
        tap((entity: Entity) => this.setInitialData(entity)),
        pluck('attributes'),
      )
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.name = new FormControl(name, [trimValidator, Validators.required]);
  }

  private extendParentFormGroup(parentForm: FormGroup): void {
    parentForm.addControl('name', this.name);
  }

  private setInitialData({ name, attributes }: Entity): void {
    this.name.setValue(name);
    if (!attributes.length) this.modelDetailsFormService.markIntact();
    this.cdr.markForCheck();
  }
}
