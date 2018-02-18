import {Component} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';
import {NavController, ToastController, IonicPage, LoadingController, Loading} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {AuthProvider} from "../../providers/auth/auth";
import {NavParams} from 'ionic-angular/navigation/nav-params';
import { PasscodeValidation } from '../../validators/passcode';

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
    public translateService: TranslateService,
    private authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    private keyboard: Keyboard) {

    const initial = this.params.get("initial");
    
    if (initial){
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
        switch(bioType){
          case "face":{
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

  async register(passcode: string, touchId: boolean) {

    this.registerSubmitAttempt = true;

    if(this.registerForm.valid){

      this.keyboard.close();
      await this.pause(500);

      this.showLoading("Setting up your secure voting application...");
      const res = await this.authProvider.register(this.registerForm.value.passcode, touchId);
      if (res.success) {
        console.log("successul registration");
        this.hideLoading();
      }
    }

    if(!this.registerForm.valid){
      console.log("Registration form values are invalid!");
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

  async login(passcode: string, enableTouchId: boolean) {

    this.loginSubmitAttempt = true;

    if(this.loginForm.valid){

      this.keyboard.close();
      await this.pause(500);
      try {
        await this.authProvider.login(this.loginForm.value.passcode, enableTouchId, "Scan fingerprint to enable touch id");
      } catch (error) {
        this.toastCtrl.create({
          message: "Invalid passcode",
          duration: 3000,
          position: 'top'
        }).present();
      }
    }

    if(!this.loginForm.valid){
      console.log("Login form values are invalid!");
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
}
