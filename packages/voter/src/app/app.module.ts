import {NgModule, ErrorHandler} from '@angular/core';
//import {RollbarModule, RollbarService} from 'angular-rollbar'
import {AppVersion} from '@ionic-native/app-version';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, Http} from '@angular/http';
import {
  IonicApp,
  IonicModule,
  IonicErrorHandler,
  PageTransition,
  Config,
  Animation
} from 'ionic-angular';
import {Storage, IonicStorageModule} from '@ionic/storage';
import {Keyboard} from '@ionic-native/keyboard';
import {InAppBrowser} from '@ionic-native/in-app-browser';


import {NetVoteApp} from './app.component';

import {SettingsPage} from '../pages/settings/settings';

import {Settings} from '../providers/settings';

import {Camera} from '@ionic-native/camera';
import {ScreenOrientation} from '@ionic-native/screen-orientation';

import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AngularFireModule} from "angularfire2";
import {AngularFirestoreModule} from "angularfire2/firestore";

// import {ComponentsModule} from '../components/components.module';

import {AuthProvider} from '../providers/auth/auth';
import {NetvoteProvider} from '../providers/netvote/netvote';

import {SecureStorage} from "@ionic-native/secure-storage";
import {TouchID} from '@ionic-native/touch-id';
import {BallotProvider} from '../providers/ballot/ballot';
import {ConfigurationProvider} from '../providers/configuration/configuration';
import {Issuehandler} from '../providers/issuehandler/issuehandler';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const firebaseConfig = {
  apiKey: "AIzaSyCYwUBgD-jq6bgbKqvLi8zjtMbRLmStN4I",
  authDomain: "netvote2.firebaseapp.com",
  databaseURL: "https://netvote2.firebaseio.com",
  projectId: "netvote2",
  storageBucket: "netvote2.appspot.com",
  messagingSenderId: "861498385067"
};

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: '',
    option3: '',
    option4: ''
  });
}

@NgModule({
  declarations: [
    NetVoteApp,
    SettingsPage
  ],
  imports: [
    // RollbarModule.forRoot({
    //   accessToken: '039693e65b814a28a657fe53656e2aff'
    // }),
    //ComponentsModule,
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(NetVoteApp, {
      pageTransition: 'fade',
      backButtonText: 'Back',
      backButtonIcon: 'arrow-back'
    },
    ),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NetVoteApp,
    SettingsPage
  ],
  providers: [
    AppVersion,
    TouchID,
    Camera,
    ScreenOrientation,
    Keyboard,
    InAppBrowser,
    SplashScreen,
    StatusBar,
    BarcodeScanner,
    SecureStorage,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    // Keep this to enable Ionic's runtime error handling during development
    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // {provide: ErrorHandler, useClass: RollbarService},
    AuthProvider,
    InAppBrowser,
    NetvoteProvider,
    BallotProvider,
    ConfigurationProvider
  ]
})
export class AppModule {
  constructor(config: Config) {
    config.setTransition('fade', FadeTransition);
  }
}

const SHOW_BACK_BTN_CSS = 'show-back-button';
export class FadeTransition extends PageTransition {
  init() {
    super.init();
    const plt = this.plt;
    const enteringView = this.enteringView;
    const leavingView = this.leavingView;
    const opts = this.opts;

    // what direction is the transition going
    const backDirection = opts.direction === 'back';

    if (enteringView) {
      if (backDirection) {
        this.duration(200);
      } else {
        this.duration(200);
        this.enteringPage.fromTo('opacity', 0, 1, true);
      }

      if (enteringView.hasNavbar()) {
        const enteringPageEle: Element = enteringView.pageRef().nativeElement;
        const enteringNavbarEle: Element = enteringPageEle.querySelector(
          'ion-navbar'
        );

        const enteringNavBar = new Animation(plt, enteringNavbarEle);
        this.add(enteringNavBar);

        const enteringBackButton = new Animation(
          plt,
          enteringNavbarEle.querySelector('.back-button')
        );
        this.add(enteringBackButton);
        if (enteringView.enableBack()) {
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
        } else {
          enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
        }
      }
    }

    // setup leaving view
    if (leavingView && backDirection) {
      // leaving content
      this.duration(200);
      const leavingPage = new Animation(plt, leavingView.pageRef());
      this.add(leavingPage.fromTo('opacity', 1, 0));
    }
  }
}