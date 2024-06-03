import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MenubarModule } from 'primeng/menubar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
  ]
})
export class LoginModule { }
