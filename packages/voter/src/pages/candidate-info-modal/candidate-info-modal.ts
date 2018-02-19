import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the CandidateInfoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-candidate-info-modal',
  templateUrl: 'candidate-info-modal.html',
})
export class CandidateInfoModalPage {

  candidateMeta: any;

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public translateService: TranslateService,
    private iab: InAppBrowser) {
  }

  ionViewWillLoad() {
    
    this.candidateMeta = this.navParams.get('data');
    
  }

  async closeCandidateInfoModal(){
    this.viewCtrl.dismiss();
  }

}
