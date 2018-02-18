import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LoginPage} from './login';
import {TranslateModule} from "@ngx-translate/core";
import {TutorialComponent} from '../../components/tutorial/tutorial';
@NgModule({
  declarations: [
    LoginPage,
    TutorialComponent
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()
  ]
})

export class LoginPageModule {
}