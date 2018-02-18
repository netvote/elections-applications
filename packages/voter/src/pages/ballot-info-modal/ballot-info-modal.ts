import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-ballot-info-modal',
  templateUrl: 'ballot-info-modal.html',
})

export class BallotInfoModalPage {

  ballotData: any;

  constructor(
    private viewCtrl: ViewController, 
    public navParams: NavParams,
    public translateService: TranslateService) {
  }

  ionViewWillLoad() {
    
    this.ballotData = this.navParams.get('data');
    
  }

  async closeBallotInfoModal(){
    this.viewCtrl.dismiss();
  }

}
