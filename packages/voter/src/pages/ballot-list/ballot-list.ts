import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController, ItemSliding } from 'ionic-angular';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';
import {GatewayProvider} from '../../providers/gateway/gateway';
import {ConfigurationProvider} from '../../providers/configuration/configuration';

@IonicPage({
  segment: "ballot-list",
  name: "ballot-list"
})
@Component({
  selector: 'page-ballot-list',
  templateUrl: 'ballot-list.html',
})
export class BallotListPage {

  ballots: Ballot[];
  searchResults: boolean = true;
  shouldAnimate: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modal: ModalController,
    private alertCtrl: AlertController,
    private ballotProvider: BallotProvider,
    private gatewayProvider: GatewayProvider,
    public config: ConfigurationProvider) {
  }

  async ionViewDidLoad() {
    this.getBallots();
  }

  goToResults(ballot) {
    this.navCtrl.push("ballot-results", {address: ballot.address, id: ballot.id, ballot: ballot.ballot, selections: ballot.currentSelected});
  }


  async getBallots() {
    const baseEthereumUrl = this.config.base.paths.ethereumBase;

    this.ballots = await this.ballotProvider.getBallots();
    
    for (let ballot of this.ballots) {
      if (ballot.status === "submitted" && ballot.collection && ballot.result && !ballot.tx) {
        ballot.waiting = true;
        const gatewayOb = this.gatewayProvider.getVoteObservable(ballot.collection, ballot.result);
        gatewayOb.subscribe(async (vote) => {
          if(vote.tx)
            ballot.waiting = false;
          await this.ballotProvider.updateBallot(ballot.address, ballot.id, {
            tx: vote.tx,
            voteId: vote.voteId,
            url: `${baseEthereumUrl}/tx/${vote.tx}`
          });
          ballot.tx = vote.tx;
          ballot.url = `${baseEthereumUrl}/tx/${vote.tx}`;
          
        });
      } else {
        ballot.waiting = false;
      }

      console.log(ballot.status);
    }
  }

  async deleteBallot(ballot) {
    this.ballots = await this.ballotProvider.removeBallot(ballot.address, ballot.id);
  }

  async delete(ballot: Ballot) {

    let alert = this.alertCtrl.create({
      subTitle: "Do you really want to remove this ballot?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button--cancel'
        },
        {
          text: 'Yes, remove it',
          handler: () => {
            this.deleteBallot(ballot)
          }
        }
      ],
      cssClass: 'nv-alert'
    });
    alert.present();

  }

  async detail(ballot: Ballot) {
    this.navCtrl.push('ballot-detail', {
      address: ballot.address,
      id: ballot.id
    })
  }

  async scanBallotPage() {
    this.navCtrl.setRoot('ballot-scan');
  }

  filterBallots(ev: any) {

    this.getBallots();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      this.ballots = this.ballots.filter((ballot) => {

        let s_results = ballot.title.toLowerCase().indexOf(val.toLowerCase()) > -1;

        if (s_results) {
          this.searchResults = false;
          return s_results;
        }
        else {
          this.searchResults = false;
        }
      })
    }
  }

  async ballotInfoModal(ballot, slidingItem: ItemSliding) {

    // Modal with extra informatino such as status, transaction id, timestamp, etc.
    const ballotInfoModal = this.modal.create('BallotInfoModalPage', { data: ballot }, {
      showBackdrop: false,
      enableBackdropDismiss: false,
      cssClass: "nv-modal  nv-modal--fullscreen  nv-modal--gradient"
    });

    // Open ballot info modal
    ballotInfoModal.present();

    // Close the sliding list item when modal is opened
    //slidingItem.close();
  }

  // Expandable Component
  // Show more info drop down
  expandItem(bItem) {

    bItem.expanded = !bItem.expanded;

    // this.ballots.map((listItem) => {

    //   if (bItem == listItem) {
    //     listItem.expanded = !listItem.expanded;
    //   } else {
    //     listItem.expanded = false;
    //   }

    //   return listItem;

    // });
  }

}
