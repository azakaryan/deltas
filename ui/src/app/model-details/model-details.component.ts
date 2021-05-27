import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ModelDetailsService} from "../core/services/api/model-details/model-details.service";
import {ActivatedRoute, Params} from "@angular/router";
import {
  catchError,
  distinctUntilKeyChanged, filter,
  finalize,
  first,
  map,
  pluck,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {Association, Entity, ModelDetails} from "../core/services/api/model-details/model-details.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelsService} from "../core/services/api/models/models.service";
import {NotificationService} from "../core/services/notification/notification.service";
import {ModelResponse, ModelUrlParams} from "../core/services/api/models/models.interface";
import {NavigationService} from "../core/services/navigation/navigation.service";
import {trimValidator} from "../shared/validators/trim.validator";
import {ModelDetailsFormService} from "./services/model-details-form.service";
import {Operation} from "fast-json-patch";

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelDetailsComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public name!: FormControl;
  public associations$!: Observable<Association[]>;
  public entities$!: Observable<Entity[]>;
  public loading = false;
  public modelNotFound = false;
  private modelId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    public modelDetailsService: ModelDetailsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modelsService: ModelsService,
    private notificationsService: NotificationService,
    private navigationService: NavigationService,
    private modelDetailsFormService: ModelDetailsFormService,
  ) {
    this.createFormControls();
    this.createForm();
    this.subscribeRouteParamsUpdates();
  }

  ngOnInit(): void {
    const modelDetails$ = this.modelDetailsService.getModelDetails();

    this.subscribeModelNameChanges(modelDetails$);

    this.associations$ = modelDetails$
      .pipe(pluck('associations'));
    this.entities$ = modelDetails$
      .pipe(pluck('entities'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  save(): void {
    const deltas: Operation[] = this.modelDetailsFormService.getDiff();

    this.modelDetailsService.updateModelDetails(this.modelId, deltas)
      .pipe(
        first(),
        tap(({ message, model }: ModelResponse) => {
          this.notificationsService.showInfo(message);
          this.modelDetailsService.setModelDetails(<ModelDetails>model);
        }),
        finalize(() => this.setLoading(false)),
      )
      .subscribe();
  }

  duplicate(): void {
    const { name } = this.getFormData();
    this.setLoading(true);

    this.modelsService.create(`copy of ${name}`)
      .pipe(
        first(),
        tap(({ message, model }: ModelResponse) => {
          this.notificationsService.showInfo(message);
          this.navigationService.navigateModelDetailsPage({ modelId: model!.id })
        }),
        finalize(() => this.setLoading(false)),
      )
      .subscribe();
  }

  delete(): void {
    this.modelsService.delete(this.modelId)
      .pipe(
        first(),
        tap(({ message, model }: ModelResponse) => {
          this.navigationService.navigateModelsPage();
        }),
        finalize(() => this.setLoading(false)),
      )
      .subscribe();
  }

  navigateToModels(): void {
    if (this.form.pristine || confirm('You have unsaved changes. Do you want to proceed ?')) {
      this.navigationService.navigateModelsPage();
    }
  }

  /*
   * Private Methods
   */
  private createFormControls(): void {
    this.name = new FormControl(null, [trimValidator, Validators.required])
  }

  private createForm(): void {
    this.form = new FormGroup({
      name: this.name,
    })
    this.modelDetailsFormService.setForm(this.form);
  }

  private subscribeRouteParamsUpdates(): void {
    this.route.params
      .pipe(
        map((routeParams: Params) => ({ modelId: routeParams['modelId'] })),
        distinctUntilKeyChanged('modelId'),
        tap((routeParams: ModelUrlParams) => this.modelId = routeParams.modelId),
        switchMap(() => this.modelDetailsService.fetchModelDetails(this.modelId)),
        catchError((err: any) => {
          this.setModelNotFound(true);
          return err;
        }),
        finalize(() => this.setLoading(false)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private subscribeModelNameChanges(modelDetails$: Observable<ModelDetails>): void {
    modelDetails$
      .pipe(
        filter((model: ModelDetails) => !!model),
        tap((model: ModelDetails) => this.setInitialData(model)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getFormData(): ModelDetails {
    return this.form.getRawValue();
  }

  private setInitialData({ name, associations, entities }: ModelDetails): void {
    this.setModelNotFound(false);
    this.name.setValue(name);
    this.modelDetailsFormService.markIntact();
    this.cdr.markForCheck();
  }

  private setLoading(flag: boolean): void {
    this.loading = flag;
    this.cdr.markForCheck();
  }

  private setModelNotFound(flag: boolean): void {
    this.modelNotFound = flag;
    this.cdr.markForCheck();
  }
}
