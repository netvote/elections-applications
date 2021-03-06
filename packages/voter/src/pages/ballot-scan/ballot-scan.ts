import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {AuthProvider} from '../../providers/auth/auth';
import {ConfigurationProvider} from '../../providers/configuration/configuration';
import {InAppBrowser} from '@ionic-native/in-app-browser';

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
    private auth: AuthProvider,
    public config: ConfigurationProvider,
    private alertCtrl: AlertController,
    private iab: InAppBrowser) {

    this.scanBypass = config.base.ballotScanBypass;

  }

  async getPasscode() {

  }

  ionViewWillLoad() {
  }

  ionViewDidLoad() {
  }

  alert(title: string, message: string, buttons: string[]) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: buttons
    }).present();
  }

  async scanBallotQr() {

    try {

      const barcodeData = await this.barcodeScanner.scan();

      const input = JSON.parse(barcodeData.text);
      const address = input.address;
      if (!address) {
        this.alert('There was a Problem', 'This is not a valid Netvote QR code', ['Dismiss']);
        return;
      }

      const token = input.token;
      const url = input.callback;

      this.importBallot(address, token);
      if (token && url)
        this.netvote.postWithAuth(token, url).then(() => {});

    } catch (err) {
      if (typeof err === "string")
        alert(err);
      console.log("NV: No scan, error: ", JSON.stringify(err));
    }
  }

  // Temporary to test in browser
  // Pretend scan was successful
  async testbypass() {
    const address = "0x2bb74b777b913502112ee8e52a198fc9dc798524";
    this.importBallot(address, null);
  }

  async importBallot(address: string, token: string) {
    const res = await this.netvote.importBallot(address, token);
    this.navCtrl.setRoot('ballot-detail', {meta: res.meta, address: address, id: res.id, token: token});
  }

  async lockApp() {
    await this.auth.lock();
  }

  goDemoUrl() {
    this.iab.create('https://netvote.io/demo', '_system', {location: 'no'});
  }

}
