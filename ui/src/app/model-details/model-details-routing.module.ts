import { RouterModule, Routes } from "@angular/router";
import { ModelDetailsComponent } from "./model-details.component";
import { NgModule } from "@angular/core";

const modelDetailsRoutes: Routes = [
  {
    path: '',
    component: ModelDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(modelDetailsRoutes)],
  exports: [RouterModule]
})
export class ModelDetailsRoutingModule { }
