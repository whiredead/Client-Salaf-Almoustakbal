import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreationRoutingModule } from './creation-routing.module';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { CreationComponent } from './creation.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FileUploadModule } from 'primeng/fileupload';


@NgModule({
  declarations: [CreationComponent],
  imports: [
    CommonModule,
    CreationRoutingModule,
    ButtonModule,
    SharedModule,
    MessagesModule,
		MessageModule,
		ButtonModule,
		ToastModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    FormsModule,
    ScrollPanelModule,
    FileUploadModule,
  ]
})
export class CreationModule { }