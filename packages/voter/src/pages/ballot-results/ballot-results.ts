import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ModalController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';

@IonicPage({
  segment: "ballot-results/:address",
  name: "ballot-results"
})
@Component({
  selector: 'page-ballot-results',
  templateUrl: 'ballot-results.html',
})
export class BallotResultsPage {

  @ViewChild(Content) content: Content;

  ballot: Ballot;
  currentSelected: any = {};
  address: string;
  canEditBallot: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private netvote: NetvoteProvider,
    private ballotProvider: BallotProvider) {

    // Address of the ballot contract  
    this.address = this.navParams.get("address");
  }

  async ionViewDidEnter() {
    
    this.ballot = await this.ballotProvider.getBallot(this.address);
    if (!this.ballot)
      return;

    if (this.ballot.selections)
      this.currentSelected = this.ballot.selections;

    const meta = await this.netvote.getRemoteBallotMeta(this.address);

    this.ballot.meta = meta;

    await this.tallyIt();

  }

  async tallyIt() {

    const res = await this.netvote.getTally(this.ballot.address);

    const ballot = res.ballots[this.address];

    if (ballot && ballot.results) {
      const results = ballot.results.ALL;
      let sectionIdx = 0;
      this.ballot.meta.ballotGroups.forEach((group, index) => {
        group.ballotSections.forEach((section, index) => {
          section.ballotItems.forEach((item, index) => {
            item.result = results[sectionIdx][item.itemTitle];
          });
          sectionIdx++;
        })

      });
    }
    
  }

}
