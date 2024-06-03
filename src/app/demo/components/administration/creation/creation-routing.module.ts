import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreationComponent } from './creation.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path:'', component:CreationComponent}
  ])],
  exports: [RouterModule]
})
export class CreationRoutingModule { }
