import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyDemoRoutingModule } from './emptydemo-routing.module';
import { EmptyDemoComponent } from './emptydemo.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        EmptyDemoRoutingModule,

        MatFormFieldModule, 
        MatInputModule, 
        MatIconModule
    ],
    declarations: [EmptyDemoComponent]
})
export class EmptyDemoModule { }