import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreationRoutingModule } from './creation-routing.module';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreationComponent } from './creation.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
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
    AvatarModule,
    FileUploadModule
    
],
})
export class CreationModule { }
