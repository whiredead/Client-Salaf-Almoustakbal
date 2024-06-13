import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    // without params
    { path:'création',loadChildren: () => import('./creation/creation.module').then(m => m.CreationModule) },
    // with params
    { path: 'création/:codeClient', loadChildren: () => import('./creation/creation.module').then(m => m.CreationModule) },
    { path:'consulterclients',loadChildren: () => import('./consulter/consulter.module').then(m => m.ConsulterModule) },
  ])],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
