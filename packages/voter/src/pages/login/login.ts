import {Component} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';
import {NavController, ToastController, AlertController, IonicPage, LoadingController, Loading} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {AuthProvider} from "../../providers/auth/auth";
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {PasscodeValidation} from '../../validators/passcode';
import {BallotProvider} from '../../providers/ballot/ballot';

@IonicPage({
  segment: "login",
  name: "login"
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  account: any = {};
  touchId = false;
  isOpenEntry: any = '';
  processing = false;
  loader: Loading;
  biometricPrompt = '';
  registerForm: FormGroup;
  loginForm: FormGroup;
  registerSubmitAttempt: boolean = false;
  loginSubmitAttempt: boolean = false;

  // Our translated text strings
  private loginErrorString: string;
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public params: NavParams,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public translateService: TranslateService,
    private authProvider: AuthProvider,
    private ballotProvider: BallotProvider,
    public loadingCtrl: LoadingController,
    private keyboard: Keyboard) {

    const initial = this.params.get("initial");

    if (initial) {
      this.isOpenEntry = initial;
    }

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;

      this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
        this.signupErrorString = value;
      })
    })

    this.registerForm = formBuilder.group({
      passcode: ['', Validators.compose([Validators.maxLength(12), Validators.pattern('^[0-9]{4,12}$'), Validators.required])],
      verifyPasscode: ['', Validators.compose([Validators.maxLength(12), Validators.pattern('^[0-9]{4,12}$'), Validators.required, PasscodeValidation.MatchPasscode])],
      touchId: [false]
    });

    this.loginForm = formBuilder.group({
      passcode: ['', Validators.compose([Validators.maxLength(12), Validators.pattern('^[0-9]{4,12}$'), Validators.required])],
      touchId: [false]
    });
  }

  async ionViewDidEnter() {

    try {
      const deviceCan = await this.authProvider.deviceHasBiometric();
      const userHas = await this.authProvider.userHasBiometric();

      if (deviceCan) {
        const bioType = await this.authProvider.getBiometricType();
        switch (bioType) {
          case "face": {
            this.biometricPrompt = "Enable Face ID";
            break;
          }
          case "touch": {
            this.biometricPrompt = "Enable Touch ID";
            break;
          }
        }
        this.touchId = true;
        if (userHas) {
          this.account.touchId = true;
          await this.authProvider.loginByBiometric();
        } else {
          this.account.touchId = false;
        }
      }

    } catch (error) {
      console.log("NV: Touch Id Errored");
    }

  }

  async register() {

    this.registerSubmitAttempt = true;

    if (!this.registerForm.controls.passcode.valid) {

      console.log("NV: Registration passcode is not valid!");

      this.presentPasscodeInvalidAlert();

    }

    if (this.registerForm.controls.passcode.valid && !this.registerForm.controls.verifyPasscode.valid) {

      let alert = this.alertCtrl.create({
        subTitle: "The passcodes you entered don't match. <br><br> Please try again.",
        buttons: ['OK'],
        cssClass: 'nv-alert'
      });
      alert.present();

    }

    if (this.registerForm.valid) {

      this.keyboard.close();
      await this.pause(500);

      this.showLoading("Setting up your secure voting application...");
      await this.ballotProvider.clear();
      const res = await this.authProvider.register(this.registerForm.value.passcode, this.registerForm.value.touchId);
      if (res.success) {
        this.hideLoading();
      }
    }
  }

  openEntryType(e, entryType) {

    e.stopPropagation();

    if (entryType === 'signin') {
      this.isOpenEntry = 'signin';
    }
    else if (entryType === 'signup') {
      this.isOpenEntry = 'signup';
    }
  }

  closeEntryType(e) {
    e.stopPropagation();
    this.isOpenEntry = '';
  }

  async login() {

    this.loginSubmitAttempt = true;

    if (this.loginForm.valid) {

      this.showLoading('Authenticating');

      this.keyboard.close();
      await this.pause(500);

      try {

        const res = await this.authProvider.login(this.loginForm.value.passcode, this.loginForm.value.touchId, "Scan fingerprint to enable touch id");

        this.hideLoading();

        if (!res.success) {
          if (res.was_reset) {
            let alert = this.alertCtrl.create({
              subTitle: 'This device has been reset. <br><br> Proceeding to Setup.',
              buttons: ['OK'],
              cssClass: 'nv-alert'
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              subTitle: 'The passcode you entered is incorrect. <br><br> Please try again.',
              buttons: ['OK'],
              cssClass: 'nv-alert'
            });
            alert.present();
          }
        }
      }
      catch (error) {

        let alert = this.alertCtrl.create({

          subTitle: "Sorry, there seems to be an issue. Please try again.",
          buttons: ['OK'],
          cssClass: 'nv-alert'
        });
        alert.present();

      }
    }

    if (!this.loginForm.valid) {
      console.log("NV: Login form values are invalid!");

      this.presentPasscodeInvalidAlert();

    }
  }

  pause(time: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve();
      }, time);
    });
  }

  showLoading(content: string) {
    this.loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: content
    });
    this.processing = true;
    this.loader.present();
  }

  hideLoading() {
    this.processing = false;
    this.loader.dismiss();
  }

  presentPasscodeInvalidAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Passcodes must be 4-12 characters in length and only numbers. <br><br> Please try again.',
      buttons: ['OK'],
      cssClass: 'nv-alert'
    });
    alert.present();
  }
}
