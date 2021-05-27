import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {RestService} from "../rest.service";
import {finalize, first, map, pluck, tap} from "rxjs/operators";
import {Association, Attribute, Entity, ModelDetails, ModelDetailsResponse} from "./model-details.interface";
import {Operation} from "fast-json-patch";

@Injectable()
export class ModelDetailsService {
  public fetching = false;
  private modelDetails$: ReplaySubject<ModelDetails> = new ReplaySubject<ModelDetails>(1);

  constructor(private restService: RestService) { }

  public getModelDetails(): Observable<ModelDetails> {
    return this.modelDetails$.asObservable();
  }

  public setModelDetails(model: ModelDetails): void {
    this.modelDetails$.next(model);
  }

  public fetchModelDetails(modelId: string): Observable<string> {
    this.fetching = true;

    return this.restService.get(`models/${modelId}`)
      .pipe(
        first(),
        finalize(() => this.fetching = false),
        tap(({ model }) => this.setModelDetails(this.normalizeModelFromApi(model))),
        pluck('message'),
      );
  }

  public updateModelDetails(modelId: string, deltas: Operation[]): Observable<ModelDetailsResponse> {
    return this.restService.post(`models/${modelId}/deltas`, { deltas })
      .pipe(
        first(),
        finalize(() => this.fetching = false),
        map(({ message, model }) => ({ message, model: this.normalizeModelFromApi(model) })),
      );
  }

  /*
   * Private Methods
   */
  private normalizeModelFromApi(model: any): ModelDetails {
    return {
      id: model._id,
      name: model.name,
      associations: model.associations.map((association: any) => this.normalizeAssociationFromApi(association)),
      entities: model.entities.map((entity: any) => this.normalizeEntityFromApi(entity)),
    };
  }

  private normalizeEntityFromApi(entity: any): Entity {
    return {
      id: entity._id,
      modelId: entity.model,
      name: entity.name,
      attributes: entity.attributes.map((attribute: any) => this.normalizeAttributeFromApi(attribute)),
    };
  }

  private normalizeAssociationFromApi(association: any): Association {
    return {
      id: association._id,
      name: association.name,
      source: association.source?.name,
      target: association.target?.name,
    };
  }

  private normalizeAttributeFromApi(attribute: any): Attribute {
    return {
      id: attribute._id,
      name: attribute.name,
      type: attribute.type,
    };
  }
}
