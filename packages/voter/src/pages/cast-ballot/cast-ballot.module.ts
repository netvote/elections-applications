import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CastBallotPage} from './cast-ballot';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    CastBallotPage,
  ],
  imports: [
    IonicPageModule.forChild(CastBallotPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class CastBallotPageModule {
}
