import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotDetailPage} from './ballot-detail';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BallotDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotDetailPage),
    TranslateModule.forChild()
  ],
})
export class BallotDetailPageModule {
}
