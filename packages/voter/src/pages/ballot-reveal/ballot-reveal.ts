import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {NetvoteProvider} from '../../providers/netvote/netvote';

@IonicPage({  
  segment: "ballot-reveal",
  name: "ballot-reveal"
})
@Component({
  selector: 'page-ballot-reveal',
  templateUrl: 'ballot-reveal.html',
})
export class BallotRevealPage {

  address: string;
  tx: string;
  ballot: any;
  currentSelected: any = {};
  loading: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public translateService: TranslateService,
    private netvote: NetvoteProvider) {
  }

  async ionViewDidLoad() {
    this.address = this.navParams.get('address');
    this.tx = this.navParams.get('tx');
    await this.getVote();
  }

  async getVote() {

    this.netvote.getVote(this.address, this.tx).subscribe(async (vote) => {

      this.ballot = await this.netvote.getRemoteBallotMeta(this.address);
      
      // TODO: We need to store the ballot address as the BC address and store the DB unique key in another property vs conflating the two.
      const key = Object.keys(vote.results.ballots)[0];
      const ballot = vote.results.ballots[key];
      

      if (ballot && ballot.results) {
        const results = ballot.results.ALL;      
        let collapsedIdx = 0;
        this.ballot.ballotGroups.forEach((group, groupIdx) => {
          group.ballotSections.forEach((section, sectionIdx) => {
            section.ballotItems.forEach((item, itemIdx) => {
              if(results[collapsedIdx][item.itemTitle] === 1) {
                this.currentSelected[`${groupIdx}-${sectionIdx}`]=itemIdx;
              }
            });
            collapsedIdx++;
          })
  
        });
      }
  
      this.loading = false;

      return true;
  
    });

  }

  returnToList() {
    this.navCtrl.setRoot('ballot-list');
  }
}
