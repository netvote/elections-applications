import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BallotInfoModalPage } from './ballot-info-modal';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BallotInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotInfoModalPage),
    TranslateModule.forChild()
  ],
})
export class BallotInfoModalPageModule {}
