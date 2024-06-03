import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'création', loadChildren: () => import('./creation/creation.module').then(m => m.CreationModule) },
    { path: '**', redirectTo: '/notfound' }
])],
  exports: [RouterModule]
})
export class DossiersRoutingModule { }
