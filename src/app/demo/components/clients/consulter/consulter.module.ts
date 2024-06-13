import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsulterRoutingModule } from './consulter-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsulterComponent } from './consulter.component';

import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [ConsulterComponent],
  imports: [
    CommonModule,
    ConsulterRoutingModule,
    SharedModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    MatButtonModule,
    MatIconModule,
    InputTextModule,
  ]
})
export class ConsulterModule { }
