import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ModelsService} from "../core/services/api/models/models.service";
import {Observable} from "rxjs";
import {Model, ModelResponse} from "../core/services/api/models/models.interface";
import {filter, first, switchMap, tap} from "rxjs/operators";
import {NotificationService} from "../core/services/notification/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {ModelCreationDialogComponent} from "./model-creation-dialog/model-creation-dialog.component";

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelComponent implements OnInit {
  public models$!: Observable<Model[]>;

  constructor(
    private cdr: ChangeDetectorRef,
    private modelsService: ModelsService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) {
    this.modelsService.fetchModels();
  }

  ngOnInit(): void {
    this.models$ = this.modelsService.getModels();
  }

  trackByFn(index: number, item: Model): string {
    return item.id;
  }

  delete(modelId: string): void {
    this.modelsService.delete(modelId)
      .pipe(
        first(),
        tap(({ message }: ModelResponse) => {
          this.notificationService.showInfo(message);
          this.modelsService.fetchModels();
        }),
      )
      .subscribe();
  }

  create(): void {
    const dialogRef = this.dialog.open(ModelCreationDialogComponent, { width: '250px' });

    dialogRef.afterClosed()
      .pipe(
        first(),
        filter((name) => !!name),
        switchMap((modelName: string) => this.modelsService.create(modelName)),
        first(),
        tap(({ message }: ModelResponse) => {
          this.notificationService.showInfo(message);
          this.modelsService.fetchModels();
        }),
      )
      .subscribe();
  }
}
