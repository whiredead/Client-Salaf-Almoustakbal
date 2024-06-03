import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatMenuModule,
    MenubarModule,
    RadioButtonModule,
    RippleModule,
    ButtonModule,
    SidebarModule
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatMenuModule,
    MenubarModule,
    RadioButtonModule,
    RippleModule,
    ButtonModule,
    SidebarModule
  ]
})
export class SharedModule { }
