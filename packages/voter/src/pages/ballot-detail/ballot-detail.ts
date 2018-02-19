import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ModalController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {AuthProvider} from '../../providers/auth/auth';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';

@IonicPage({
  segment: "ballot/:address",
  name: "ballot-detail"
})
@Component({
  selector: 'page-ballot-detail',
  templateUrl: 'ballot-detail.html',
})
export class BallotDetailPage {

  @ViewChild(Content) content: Content;

  ballot: Ballot;
  currentSelected: any = {};
  address: string;
  canEditBallot: boolean = false;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private netvote: NetvoteProvider,
    private auth: AuthProvider,
    private ballotProvider: BallotProvider) {

    // Address of the ballot contract  
    this.address = navParams.get("address");
  }

  async ionViewDidEnter() {
    
    this.ballot = await this.ballotProvider.getBallot(this.address);
    if (!this.ballot)
      return;

    if (this.ballot.selections)
      this.currentSelected = this.ballot.selections;

    let meta = this.navParams.get("meta");
    if (!meta) {
      meta = await this.netvote.getRemoteBallotMeta(this.address);
    }
    this.ballot.meta = meta;

    if (this.ballot.status !== 'submitted') {

      this.canEditBallot = true;
      // Resize content when footer not shown
      this.content.resize();
    }
  }

  // Ballot item selection
  selectBallotItem(groupIndex, sectionIndex, itemIndex, ballotItem) {
    this.currentSelected[`${groupIndex}-${sectionIndex}`] = itemIndex;
  }

  // Remove all selected choices in ballot
  clearSelectedBallots(groupIndex, sectionIndex) {
    this.currentSelected[`${groupIndex}-${sectionIndex}`] = null;
  }

  // Send vote selections to cast ballot page to confirm and send
  enterCastFlow() {
    this.navCtrl.push("cast-ballot", {address: this.address, ballot: this.ballot, selections: this.currentSelected});
  }

  // Cancel editing and return to list
  cancelBallotEdit() {
    this.canEditBallot = false;

    // Resize content when footer not shown
    this.content.resize();
  }

  toggleEditBallot() {

    this.canEditBallot = !this.canEditBallot;

    // Resize content when footer not shown
    this.content.resize();
  }

  viewOnBlockchain(ballot: Ballot) {
    if (ballot.tx)
      window.open(ballot.url, "_system");
  }

  async testRequest() {
    const prompt = this.modalCtrl.create("get-passcode", {title: "Enter passcode to proceed", returnPasscode: true, allowCancel: true});
    prompt.onDidDismiss(async (passcode) => {
      if (passcode) {
        try {
          const wallet = await this.auth.getWalletAddress(passcode, this.address);
        } catch (err) {
          console.log("NV: Err", err.message);
        }
      }
    });
    prompt.present();
  }


  // LEAVE THIS FOR NOW
  // Expandable Component
  // Show more info drop down
  // expandItem(bItem) {

  //   this.ballotItems.map((listItem) => {

  //     if (bItem == listItem) {
  //       listItem.expanded = !listItem.expanded;
  //     } else {
  //       listItem.expanded = false;
  //     }

  //     return listItem;

  //   });
  // }
}
