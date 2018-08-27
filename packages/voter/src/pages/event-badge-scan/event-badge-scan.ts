import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {AuthProvider} from '../../providers/auth/auth';
import {ConfigurationProvider} from '../../providers/configuration/configuration';
import {InAppBrowser} from '@ionic-native/in-app-browser';

@IonicPage({
  segment: "event-badge-scan",
  name: "event-badge-scan"
})
@Component({
  selector: 'event-badge-scan',
  templateUrl: 'event-badge-scan.html',
})
export class EventBadgeScanPage {

  scanBypass: boolean = false;
  newScan: boolean = false;
  externalToken: string;

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

  async ionViewDidLoad() {
    this.externalToken = await this.auth.getExternalToken();
  }

  alert(title: string, message: string, buttons: string[]) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: buttons
    }).present();
  }

  async scanQr() {

    try {

      const barcodeData = await this.barcodeScanner.scan();

      const input = JSON.parse(barcodeData.text);
      const groupId = input.groupId;
      const token = input.token;
      if (!groupId || !token) {
        this.alert('There was a Problem', 'This is not a valid Netvote Event Badge', ['Dismiss']);
        return;
      }

      await this.auth.setExternalToken(token);
      console.log("NV: External Token", token);
      this.externalToken = token;
      this.newScan = true;

    } catch (err) {
      if (typeof err === "string")
        alert(err);
      console.log("NV: No scan, error: ", JSON.stringify(err));
    }
  }

  enterCode() {

    const prompt = this.alertCtrl.create({
      title: 'Ballot',
      message: "Enter a Ballot Code",
      inputs: [
        {
          name: 'code',
          placeholder: 'Ballot Code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Submit',
          handler: async (data) => {
            const code = data.code;
            console.log("NV: Code", code);
            const ballot: any = await this.netvote.getBallotFromCode(code, this.externalToken);
            console.log("NV: API Return", JSON.stringify(ballot));
            const address = ballot.address;
            const token = ballot.token;
            const res = await this.netvote.importBallot(address, token);
            this.navCtrl.setRoot('ballot-detail', {meta: res.meta, address: address, id: res.id, token: token});
        
          }
        }
      ]
    });
    prompt.present();
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
