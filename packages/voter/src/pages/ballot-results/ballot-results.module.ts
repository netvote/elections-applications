import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotResultsPage} from './ballot-results';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from '../../components/components.module';
@NgModule({
  declarations: [
    BallotResultsPage
  ],
  imports: [
    IonicPageModule.forChild(BallotResultsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class BallotResultsPageModule {
}
