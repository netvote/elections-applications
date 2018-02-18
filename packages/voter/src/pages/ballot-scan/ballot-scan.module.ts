import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotScanPage} from './ballot-scan';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BallotScanPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotScanPage),
    TranslateModule.forChild()
  ],
})
export class BallotScanPageModule {
}
