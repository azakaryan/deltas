import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'models',
    loadChildren: () => import('./model/model.module').then(m => m.ModelModule),
    data: { title: 'Models Page' },
  },
  {
    path: 'models/:modelId',
    loadChildren: () => import('./model-details/model-details.module').then(m => m.ModelDetailsModule),
    data: { title: 'Models Details Page' },
  },
  {
    path: '**',
    redirectTo: '/models',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
