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

  ionViewDidLoad() {
    this.address = this.navParams.get('address');
    this.tx = this.navParams.get('tx');
    this.getVote();
  }

  async getVote() {
    const vote = await this.netvote.getVote(this.address, this.tx);
    this.ballot = await this.netvote.getRemoteBallotMeta(this.address);

    const ballot = vote.ballots[this.address];
    
    if (ballot && ballot.results) {
      const results = ballot.results.ALL;      
      let collapsedIdx = 0;
      this.ballot.ballotGroups.forEach((group, groupIdx) => {
        group.ballotSections.forEach((section, sectionIdx) => {
          section.ballotItems.forEach((item, itemIdx) => {
            if(results[collapsedIdx][item.itemTitle] === 1) {
              this.currentSelected[`${groupIdx}-${sectionIdx}`]=itemIdx;
            }
            //this.currentSelected[`${sectionIdx}-${index}`]
            // item.result = {};
            // item.result.counts = results[sectionIdx][item.itemTitle];
            // item.result.group = group;
            // item.result.section = section;
          });
          collapsedIdx++;
        })

      });
    }

    this.loading = false;

    console.log("NV: selections; ", this.currentSelected);
    console.log("NV: ballot; ", this.ballot);
    console.log("NV: vote; ", vote);
  }

  returnToList() {
    this.navCtrl.setRoot('ballot-list');
  }
}
