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
      
      const input = JSON.parse(barcodeData.text);
      const address = input.address;
      const token = input.token;

      this.importBallot(address, token);
    } catch (err) {
      console.log("NV: No scan, error: ", err);
    }

  }

  // Temporary to test in browser
  // Pretend scan was successful
  async testbypass() {
    const address = "0x3e0e98b422261242519e4cba69c0afaa47da2d3f";
    this.importBallot(address, null);
  }

  async importBallot(address: string, token: string) {
    const data = await this.netvote.getRemoteBallotMeta(address);
    let ballot = await this.ballotProvider.getBallot(address);
    if(!ballot) {
      ballot = new Ballot(address, data.ballotTitle, data.ipfs, data.type);
      await this.ballotProvider.addBallot(ballot);
    }
    this.navCtrl.setRoot('ballot-detail', {meta: data, address: address, token: token});
  }

  async lockApp() {
    await this.auth.lock();
  }

}
