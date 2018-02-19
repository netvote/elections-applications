import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NavController, NavParams, ModalController} from 'ionic-angular';

import {Settings} from '../../providers/settings';
import {TranslateService} from '@ngx-translate/core';
import {AuthProvider} from '../../providers/auth/auth';
import {BallotProvider} from '../../providers/ballot/ballot';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    private authProvider: AuthProvider,
    private ballotProvider: BallotProvider,
    public modalCtrl: ModalController) {
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
  }

  resetDevice() {    
    const prompt = this.modalCtrl.create("get-passcode", {title: "Enter passcode to reset device", returnPasscode: true, allowCancel: true, allowBiometric: false});
    prompt.onDidDismiss(async (passcode) => {
      if (passcode) {
        await this.ballotProvider.clear();
        await this.authProvider.reset(passcode);
      }
    });
    prompt.present();
  }
}
