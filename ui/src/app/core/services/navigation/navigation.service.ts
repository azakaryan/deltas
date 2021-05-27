import { Injectable } from "@angular/core";
import {Router} from "@angular/router";
import {ModelUrlParams} from "../api/models/models.interface";

@Injectable()
export class NavigationService {

  constructor(private router: Router) {}

  navigateModelDetailsPage({ modelId }: ModelUrlParams): void {
    this.router.navigate(['models'], { queryParams: { modelId } });
  }

  navigateModelsPage(): void {
    this.router.navigate(['models']);
  }
}
