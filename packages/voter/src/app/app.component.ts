import {Component, ViewChild, NgZone} from '@angular/core';
import {Platform, Nav, Config, Content, LoadingController, AlertController} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ScreenOrientation} from '@ionic-native/screen-orientation';
import {SettingsPage} from '../pages/settings/settings';
import {Settings} from '../providers/providers';
import {TranslateService} from '@ngx-translate/core'
import {Account} from "../models/account";
import {AuthProvider, AuthState, AuthStateChange} from "../providers/auth/auth";
import {NetvoteProvider} from "../providers/netvote/netvote";

import {ModalController} from 'ionic-angular/components/modal/modal-controller';


@Component({
  template: `
  <ion-menu [content]="content" type="overlay">

    <ion-content>
      <ion-list no-lines>
      
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
        <button menuClose ion-item (click)="logout()">Logout</button>
      
      </ion-list>
    </ion-content>

  </ion-menu>

  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class NetVoteApp {

  @ViewChild(Nav) navCtrl: Nav;
  @ViewChild(Content) content: Content;

  loader: any;
  rootPage: string;
  account: Account;
  unlocking: boolean;

  pages: any[] = [
    {title: 'My Ballots', component: "ballot-list"},
    {title: 'Scan a Ballot', component: "ballot-scan"},
    {title: 'Settings', component: SettingsPage},
  ];

  constructor(private translate: TranslateService,
    platform: Platform,
    settings: Settings,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public zone: NgZone,
    private screenOrientation: ScreenOrientation,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private authProvider: AuthProvider,
    private modalCtrl: ModalController,
    private netvote: NetvoteProvider,
  ) {

    platform.ready().then(() => {
      platform.resume.subscribe((e) => {
        branchInit();
      });
      platform.pause.subscribe(async (e) => {
        //await this.authProvider.lock();
      });
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      branchInit();
    });

    const branchInit = () => {
      if (!platform.is('cordova')) {return;}
      const Branch = window['Branch'];
      Branch.initSession(async (data) => {
        const res: any = await this.netvote.ImportBallotByUrl(data['+non_branch_link']);
        if (res.address) {
          this.navCtrl.setRoot('ballot-detail', {meta: res.meta, address: res.address, id: res.id, token: res.token});
        }
      });
    }

    this.initializeAuth();
    this.initTranslate();

  }


  showLoading() {

    this.loader = this.loadingCtrl.create({
      spinner: 'circles'
    });

    this.loader.present();
  }

  ionViewDidLoad() {

    // Must be set for background colors to work in iOS
    this.statusBar.overlaysWebView(false);

    // Gives text in status bar white color
    this.statusBar.styleLightContent();

    this.splashScreen.hide();

  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
  }


  initializeAuth() {

    this.authProvider.getAuthStateObservable().subscribe((auth: AuthStateChange) => {

      const active = this.navCtrl.getActive();

      if (auth.current === AuthState.LoggedIn) {
        if (active === undefined || auth.prior !== AuthState.Locked)
          this.navCtrl.setRoot('ballot-list')
      } else if (auth.current === AuthState.Locked && !this.unlocking) {
        this.unlocking = true;
        this.modalCtrl.create("get-passcode", {title: "Enter passcode to unlock", allowBiometric: true}).present().then(() => {this.unlocking = false;});
      } else if (auth.current === AuthState.NotSetUp) {
        this.navCtrl.setRoot('login', {initial: "initial"});
      } else {
        this.navCtrl.setRoot('login', {initial: "signin"});
      }

    });

  }

  async logout() {

    const bioType = await this.authProvider.getBiometricType();

    this.alertCtrl.create({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Logout',
          handler: data => {

            this.account = null;
            this.authProvider.logout(bioType === "face").then(() => {

            });
          }
        }
      ]
    }).present();

  }

}
