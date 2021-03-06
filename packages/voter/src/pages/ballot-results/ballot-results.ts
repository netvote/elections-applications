import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ModalController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';
import {Tally} from '@netvote/core';

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
  id: string;
  canEditBallot: boolean = false;
  tallied: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private netvote: NetvoteProvider,
    private ballotProvider: BallotProvider) {

    // Address of the ballot contract  
    this.address = this.navParams.get("address");
    this.id = this.navParams.get("id");
  }

  async ionViewDidEnter() {
    
    this.ballot = await this.ballotProvider.getBallot(this.address, this.id);
    if (!this.ballot)
      return;

    if (this.ballot.selections)
      this.currentSelected = this.ballot.selections;

    const meta = await this.netvote.getRemoteBallotMeta(this.address);

    this.ballot.meta = meta;

    await this.tallyIt();

  }

  async tallyIt() {

    this.netvote.getTally(this.ballot.address).subscribe((tally: Tally)=>{
      const resultData = JSON.parse(tally.results);
      const results = resultData.ballots[Object.keys(resultData.ballots)[0]].results.ALL;
      let sectionIdx = 0;
      this.ballot.meta.ballotGroups.forEach((group, index) => {
        group.ballotSections.forEach((section, index) => {
          section.ballotItems.forEach((item, index) => {
            item.result = {};
            item.result.counts = results[sectionIdx][item.itemTitle];
            item.result.group = group;
            item.result.section = section;
          });
          sectionIdx++;
        })

      });

      this.tallied = true;
      
    });
    
  }

  async detail(ballot: Ballot) {
    this.navCtrl.setRoot('ballot-list');
  }

}
