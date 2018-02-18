import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotResultsPage} from './ballot-results';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BallotResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotResultsPage),
    TranslateModule.forChild()
  ],
})
export class BallotResultsPageModule {
}
