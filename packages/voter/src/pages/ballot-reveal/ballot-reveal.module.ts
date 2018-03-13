import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotRevealPage} from './ballot-reveal';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    BallotRevealPage,
  ],
  imports: [
    IonicPageModule.forChild(BallotRevealPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class BallotRevealPageModule {}
