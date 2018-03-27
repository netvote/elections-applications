import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotDetailPage} from './ballot-detail';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    BallotDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotDetailPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class BallotDetailPageModule {
}
