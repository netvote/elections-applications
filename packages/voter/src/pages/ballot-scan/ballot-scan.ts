import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {AuthProvider} from '../../providers/auth/auth';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';
import {ConfigurationProvider} from '../../providers/configuration/configuration';

@IonicPage({
  segment: "ballot-scan",
  name: "ballot-scan"
})
@Component({
  selector: 'page-ballot-scan',
  templateUrl: 'ballot-scan.html',
})
export class BallotScanPage {

  scanBypass: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private netvote: NetvoteProvider,
    private ballotProvider: BallotProvider,
    private auth: AuthProvider,
    public config: ConfigurationProvider) {

      this.scanBypass = config.base.ballotScanBypass;

  }

  async getPasscode() {

  }

  ionViewWillLoad() {
  }

  ionViewDidLoad() {
  }

  async scanBallotQr() {

    try {

      const barcodeData = await this.barcodeScanner.scan();
      const address = barcodeData.text;
      const data = await this.netvote.getRemoteBallotMeta(address);
      const ballot = new Ballot(address, data.ballotTitle, data.ipfs, data.type)
      await this.ballotProvider.addBallot(ballot);
      this.navCtrl.setRoot('ballot-detail', {meta: data, address: address});

    } catch (err) {
      console.log("NV: No scan, error: ", err);
    }

  }

  // Temporary to test in browser
  // Pretend scan was successful
  async testbypass() {

    const address = "0x3e0e98b422261242519e4cba69c0afaa47da2d3f";
    //const address = "0x2788b142f3a23a3cd66a34faa585e2c58467f154";
    //const address = "0xcc4e70ea8a0fd2a9cfa14c36ba961e9b05b3ca93";
    //const address = "0xe612241f9d5b810ce3f76a449d45a0d044475f2e";
    //const address = "0x24c23193360b2cd37b936c59b0b86a5b055ceb04";
    const data = await this.netvote.getRemoteBallotMeta(address);
    const ballot = new Ballot(address, data.ballotTitle, data.ipfs, data.type)
    await this.ballotProvider.addBallot(ballot);
    this.navCtrl.setRoot('ballot-detail', {meta: data, address: address});

  }

  async lockApp() {
    await this.auth.lock();
  }

}
