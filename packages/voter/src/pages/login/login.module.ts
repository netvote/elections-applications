import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LoginPage} from './login';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from '../../components/components.module';
@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild(),
    ComponentsModule
  ]
})

export class LoginPageModule {
}