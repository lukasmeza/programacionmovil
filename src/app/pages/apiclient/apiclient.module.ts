import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApiclientPageRoutingModule } from './apiclient-routing.module';

import { ApiclientPage } from './apiclient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApiclientPageRoutingModule
  ],
  declarations: [ApiclientPage]
})
export class ApiclientPageModule {}
