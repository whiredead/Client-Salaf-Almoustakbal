import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'création', loadChildren: () => import('./creation/creation.module').then(m => m.CreationModule) },
    { path: 'création/:reference', loadChildren: () => import('./creation/creation.module').then(m => m.CreationModule) },
    { path: 'consulterdossiers', loadChildren: () => import('./consulter/consulter.module').then(m => m.ConsulterModule) },
    { path: '**', redirectTo: '/notfound' }
])],
  exports: [RouterModule]
})
export class DossiersRoutingModule { }
