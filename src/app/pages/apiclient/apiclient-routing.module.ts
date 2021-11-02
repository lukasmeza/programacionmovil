import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiclientPage } from './apiclient.page';

const routes: Routes = [
  {
    path: '',
    component: ApiclientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiclientPageRoutingModule {}
