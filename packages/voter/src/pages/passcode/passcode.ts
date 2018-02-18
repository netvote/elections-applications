import {Component} from '@angular/core';
import {NavController, ToastController, IonicPage, ViewController, NavParams} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage({
  segment: "get-passcode",
  name: "get-passcode"
})
@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html'
})
export class PasscodePage {

  account: any = {};
  title: string;
  returnPasscode = false;
  allowCancel = false;
  allowBiometric = false;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private authProvider: AuthProvider,
    private viewCtrl: ViewController,
    private params: NavParams) {

    this.title = this.params.get("title") || "Enter passcode to unlock";
    this.returnPasscode = this.params.get("returnPasscode") === true;
    this.allowCancel = this.params.get("allowCancel") === true;
    this.allowBiometric = this.params.get("allowBiometric") === true;
  }

  async done(passcode: string) {
    const check = await this.authProvider.checkLogin(passcode);
    if (check.success) {
      const res = await this.authProvider.login(passcode);
      if (res.success) {
        if (this.returnPasscode)
          this.viewCtrl.dismiss(passcode);
        else
          this.viewCtrl.dismiss();
      } else
        this.viewCtrl.dismiss();
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  async ionViewDidEnter() {

    if (this.allowBiometric) {
      try {
        const userHas = await this.authProvider.userHasBiometric();

        if (userHas) {
          const res = await this.authProvider.loginByBiometric(undefined, {returnPasscode: this.returnPasscode});
          if (res.success)
            if (this.returnPasscode)
              this.viewCtrl.dismiss(res.passcode);
            else
              this.viewCtrl.dismiss();
        }

      } catch (error) {
        console.log("NV: Touch Id Errored");
      }
    }
  }
}
