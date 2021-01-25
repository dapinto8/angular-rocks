import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BandCreateEditComponent } from './components/band-create-edit/band-create-edit.component';
import { BandListComponent } from './components/band-list/band-list.component';

const routes: Routes = [
  {
    path: 'band/:slug',
    component: BandCreateEditComponent
  },
  {
    path: 'bands',
    component: BandListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
