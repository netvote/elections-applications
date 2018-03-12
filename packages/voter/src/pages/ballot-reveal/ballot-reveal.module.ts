import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotRevealPage} from './ballot-reveal';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BallotRevealPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotRevealPage),
    TranslateModule.forChild()
  ],
})
export class BallotRevealPageModule {}
