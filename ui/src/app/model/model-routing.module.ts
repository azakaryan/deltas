import { RouterModule, Routes } from "@angular/router";
import { ModelComponent } from "./model.component";
import { NgModule } from "@angular/core";

const modelRoutes: Routes = [
  {
    path: '',
    component: ModelComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(modelRoutes)],
  exports: [RouterModule]
})
export class ModelRoutingModule { }
