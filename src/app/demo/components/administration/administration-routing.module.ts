import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(
    [    { path:'créerutilisateur', loadChildren: () => import('./creation/creation.module').then(m => m.CreationModule)}
  ]
  )],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
