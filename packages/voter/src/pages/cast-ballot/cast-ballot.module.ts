import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CastBallotPage} from './cast-ballot';
import {TranslateModule} from "@ngx-translate/core";
import {SpinnerComponent} from "../../components/spinner/spinner";


@NgModule({
  declarations: [
    CastBallotPage,
    SpinnerComponent
  ],
  imports: [
    IonicPageModule.forChild(CastBallotPage),
    TranslateModule.forChild(),
  ],
})
export class CastBallotPageModule {
}
