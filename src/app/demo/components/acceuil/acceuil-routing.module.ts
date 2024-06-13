import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {path:'acceuil', component:AcceuilComponent}
  ])],
  exports: [RouterModule]
})
export class AcceuilRoutingModule { }
