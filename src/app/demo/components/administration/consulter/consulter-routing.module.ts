import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsulterComponent } from './consulter.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(
    [
      {path:'',component:ConsulterComponent}
    ])],  exports: [RouterModule]
})
export class ConsulterRoutingModule { }
