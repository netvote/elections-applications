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
    console.log("BALLOT INFO: ", this.ballotData);
    
  }

  async closeBallotInfoModal(){
    this.viewCtrl.dismiss();
  }

  matchStatusClass(status, waiting){

    if(status === 'submitted' && waiting){
      return 'is-positive'
    }
    else if(status === 'submitted'){
      return 'is-attention'
    }
    else{
      return 'is-'+status;
    }
  }
}
