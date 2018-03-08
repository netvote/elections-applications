import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {InAppBrowser} from '@ionic-native/in-app-browser';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {BallotProvider} from '../../providers/ballot/ballot';
import {GatewayProvider} from '../../providers/gateway/gateway';
import {ConfigurationProvider} from '../../providers/configuration/configuration';

@IonicPage({
  segment: "cast-ballot",
  name: "cast-ballot"
})
@Component({
  selector: 'page-cast-ballot',
  templateUrl: 'cast-ballot.html',
})

export class CastBallotPage {

  verifyBypass: boolean = false;

  ballot: any;
  currentSelected: any;
  token: string;
  ballotStatus: string;
  address: string;
  verificationCode: string;
  voterKeys: any;
  waiting: boolean = false;

  constructor(

    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    private barcodeScanner: BarcodeScanner,
    private iab: InAppBrowser,
    private netvote: NetvoteProvider,
    private ballotProvider: BallotProvider,
    private gatewayProvider: GatewayProvider,
    public config: ConfigurationProvider) {

    this.verifyBypass = config.base.ballotVerifyBypass;

    this.address = this.navParams.get('address');
    this.ballot = this.navParams.get('ballot');
    this.currentSelected = this.navParams.get('selections');
    this.token = this.navParams.get('token');

    this.voterKeys = ["c5d54403-fb33-40cb-813d-3fae551879ba",
      "88ff8a86-534f-4896-9c57-9ed63f0aff22",
      "1cf3ba80-d331-4390-8fd8-4856677c8088",
      "484329d8-4468-419f-b180-e2cf5eab55b7",
      "d6333011-b65b-4d2b-b135-48ae68d6b1c4",
      "7cfbaddd-03a1-4b11-a6b3-60de150c99f1",
      "0a1ed875-6e19-4612-acf2-9e6a9b71eded",
      "cbbcb665-c655-4610-84f8-7c73712c13e0",
      "0d850c17-bbc3-4d2a-a021-0eb8e8d2c5cf",
      "72a18615-ce88-4ede-b9eb-5b000715edf0"];

    this.verificationCode = this.voterKeys[0];

    this.ballotStatus = 'confirming';
  }

  ionViewDidLoad() {

  }

  secureVotes() {
    if(!this.token)
      this.ballotStatus = "securing";
    else{
      this.ballotStatus = "submitting"
      this.submitVote(this.token, this.currentSelected);
    }
  }

  viewResults() {
    this.navCtrl.setRoot("ballot-results", {address: this.address});
  }

  backToBallotList() {
    this.navCtrl.setRoot('ballot-list');
  }

  async submitVote(token: string, selections: any) {

    let vote = {
      encryptionSeed: Math.floor(Math.random() * 9999999) + 1000000,
      ballotVotes: [{choices: []}]
    };

    this.ballot.meta.ballotGroups.forEach((group, groupIndex) => {
      group.ballotSections.forEach((section, sectionIndex) => {
        const selection = selections[`${groupIndex}-${sectionIndex}`];
        vote.ballotVotes[0].choices.push({selection: selection == null ? null : +selection});
      });
    });

    const voteBase64 = await this.netvote.encodeVote(vote);
    const result: any = await this.netvote.submitVote(voteBase64, token);
    const baseEthereumUrl = this.config.base.paths.ethereumBase;

    await this.ballotProvider.updateBallot(this.address, {
      status: "submitted",
      result: result.txId,
      collection: result.collection,
      selections: selections
    });

    this.ballotStatus = "submitted";
    this.waiting = true;

    console.log(`NV: Waiting on ${result.collection} for item ${result.txId}`);
    
    const gatewayOb = this.gatewayProvider.getVoteObservable(result.collection, result.txId);
    gatewayOb.subscribe(async (vote) => {

      console.log(`NV: Observer response`);

      if (vote.tx) {
        this.waiting = false;
        console.log(`NV: Observer response with tx`);
      }

      await this.ballotProvider.updateBallot(this.address, {
        tx: vote.tx,
        voteId: vote.voteId,
        url: `${baseEthereumUrl}/tx/${vote.tx}`
      });
      this.ballot.tx = vote.tx;
      this.ballot.url = `${baseEthereumUrl}/tx/${vote.tx}`;
    });

  }

  async scanVerificationQr(test: boolean, selections: any) {

    try {

      let token: any, barcodeData: any, verificationCode: any;

      if (test) {
        verificationCode = this.verificationCode;
      }
      else {
        barcodeData = await this.barcodeScanner.scan();
        verificationCode = barcodeData.text;
      }

      this.viewCtrl.showBackButton(false);

      this.ballotStatus = "submitting";

      token = await this.netvote.getVoterToken(verificationCode, this.address);

      await this.submitVote(token, selections);

    } catch (err) {
      console.log("NV: No scan, error: ", err);
    }
  }

  // Cancel and return to previous page
  async returnToBallot() {
    this.navCtrl.pop();
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

  onContentLoad() {

  }
  
}
