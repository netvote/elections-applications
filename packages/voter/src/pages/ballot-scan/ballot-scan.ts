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
      if(!address){
        this.alert('There was a Problem', 'This is not a valid Netvote QR code', ['Dismiss']);
        return;
      }
        
      const token = input.token;
      this.importBallot(address, token);
      
    } catch (err) {
      this.alert('There was a Problem', 'This is not a valid Netvote QR code', ['Dismiss']);
      console.log("NV: No scan, error: ", err);
    }
  }

  // Temporary to test in browser
  // Pretend scan was successful
  async testbypass() {
    const address = "0x2781cb442c98bbecf37119b872913f1c39e0612d";
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
    const browser = this.iab.create('https://netvote.io/demo','_system',{location:'no'}); 
    browser.show();
  }

}
