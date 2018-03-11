import {Component} from '@angular/core';
import {IonicPage, NavParams, NavController, ViewController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {NetvoteProvider} from '../../providers/netvote/netvote';

@IonicPage()
@Component({
  selector: 'page-ballot-info-modal',
  templateUrl: 'ballot-info-modal.html',
})

export class BallotInfoModalPage {

  ballotData: any;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private iab: InAppBrowser,
    private netvote: NetvoteProvider,) {
  }

  ionViewWillLoad() {

    this.ballotData = this.navParams.get('data');
    if(this.ballotData.tx){      
      this.getVote();
    }
      

  }

  async getVote() {
    const vote = await this.netvote.getVote(this.ballotData.address, this.ballotData.tx);
    console.log(JSON.stringify(vote));
  }

  async closeBallotInfoModal() {
    this.viewCtrl.dismiss();
  }

  // goToResults() {
  //   this.viewCtrl.dismiss();
  //   this.navCtrl.setRoot("ballot-results");
  // }

  matchStatusClass(status, waiting) {

    if (status === 'submitted' && waiting) {
      return 'is-positive'
    }
    else if (status === 'submitted') {
      return 'is-attention'
    }
    else {
      return 'is-' + status;
    }
  }

  launchTxLink(url: string) {

    let iabDoneText: string;

    this.translateService.get(['IAB_DONE_BUTTON_TEXT']).subscribe(values => {
      iabDoneText = values.IAB_DONE_BUTTON_TEXT;
    });

    const iabOptions = "location=yes,clearcache=yes,transitionstyle=crossdissolve,toolbarcolor=#071822,closebuttoncolor=#5BC0BE,closebuttoncaption=" + iabDoneText;

    const browser = this.iab.create(url, '_blank', iabOptions);

    browser.show();

  }
}
