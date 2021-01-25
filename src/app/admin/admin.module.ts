import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { BandCreateEditComponent } from './components/band-create-edit/band-create-edit.component';
import { BandDeleteDialogComponent } from './components/band-delete-dialog/band-delete-dialog.component';
import { BandListComponent } from './components/band-list/band-list.component';
import { UploadInputComponent } from './components/upload-input/upload-input.component';



@NgModule({
  declarations: [
    BandCreateEditComponent,
    UploadInputComponent,
    BandListComponent,
    BandDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
