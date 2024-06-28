import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcceuilRoutingModule } from './acceuil-routing.module';
import { TableModule } from 'primeng/table';
import { AcceuilComponent } from './acceuil.component';


@NgModule({
  declarations: [AcceuilComponent],
  imports: [
    CommonModule,
    AcceuilRoutingModule,
    TableModule,

  ]
})
export class AcceuilModule { }
