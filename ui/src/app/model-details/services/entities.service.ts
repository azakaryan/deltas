import { Injectable } from "@angular/core";
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";

@Injectable()
export class EntitiesService {
  private entityNames$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {}

  setEntityNames(names: string[]): void {
    this.entityNames$.next(names);
  }

  getEntityNames(): Observable<string[]> {
    return this.entityNames$.asObservable();
  }
}
