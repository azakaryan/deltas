import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {Model, ModelResponse} from "./models.interface";
import {finalize, first, map, tap} from "rxjs/operators";
import {RestService} from "../rest.service";
import {ModelDetails} from "../model-details/model-details.interface";

@Injectable()
export class ModelsService {
  public fetching = false;
  private models$: ReplaySubject<Model[]> = new ReplaySubject<Model[]>(1);

  constructor(private restService: RestService) { }

  public getModels(): Observable<Model[]> {
    return this.models$.asObservable();
  }

  public fetchModels(): void {
    this.fetching = true;

    this.restService.get('models').pipe(
      first(),
      finalize(() => this.fetching = false),
      tap(({ models }: ModelResponse) => this.setModels(this.normalizeModelsFromApi(<ModelDetails[]>models))),
    ).subscribe();
  }

  public delete(modelId: string): Observable<ModelResponse> {
    return this.restService.delete(`models/${modelId}`);
  }

  public create(name: string): Observable<ModelResponse> {
    return this.restService.post('models', { name })
      .pipe(
        map(({ message, model }: ModelResponse) => ({ message, model: this.normalizeModelFromApi(model) })),
      );
  }

  /*
   * Private Methods
   */
  private setModels(models: Model[]): void {
    this.models$.next(models);
  }

  private normalizeModelsFromApi(models: any[]): Model[] {
    return models.map((model: any) => this.normalizeModelFromApi(model));
  }

  private normalizeModelFromApi(model: any): Model {
    return { id: model._id, name: model.name };
  }
}
