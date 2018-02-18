import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PasscodePage} from './passcode';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    PasscodePage,
  ],
  imports: [
    IonicPageModule.forChild(PasscodePage),
    TranslateModule.forChild()
  ]
})
export class PasscodePageModule {
}
