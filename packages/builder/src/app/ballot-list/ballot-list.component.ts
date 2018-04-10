import {Component, OnInit, ElementRef} from '@angular/core';
import {BallotService} from '../services/ballot.service';
import {Ballot} from '@netvote/core';
import {Observable} from 'rxjs/Observable';
import {ToastService} from '../services/toast.service';

import { SpinnerService } from '@chevtek/angular-spinners';

@Component({
  selector: 'app-ballot-list',
  templateUrl: './ballot-list.component.html',
  styleUrls: ['./ballot-list.component.scss']
})
export class BallotListComponent implements OnInit {

  ballots: Observable<Ballot[]>;
  hasBallots: boolean;
  testJson: any;
  //manager: BallotManager;

  constructor(
    public spinnerService: SpinnerService,
    private ballotService: BallotService,
    private elementRef: ElementRef,
    private toast: ToastService) {

    //this.manager = new BallotManager();
    this.ballots = this.ballotService.getOrgBallots();

  }

  toggleQR(ballot) {
    ballot.showQR = !ballot.showQR;
  }

  async getMetrics(ballot) {

    // this.manager.getBallotMetrics(ballot);

  }

  registerSelf(ballot: Ballot) {

    // this.manager.registerSelf(ballot)

    //   .then((res) => {

    //     console.log('Registered', res);

    //     return {tx: res.tx};

    //   })
    //   .catch((err) => {
    //     this.toast.error('Unable to register.');
    //   });
  }

  voteInBallot(ballot: Ballot, counts: number[]) {
    
    // this.manager.voteInBallot(ballot, counts)

    //   .then((res) => {

    //     console.log('Voted', res);

    //     return {tx: res.tx};

    //   })
    //   .catch((err) => {
    //     this.toast.error('Unable to vote.');
    //   });
  }

  async testDelete(ballot) {

    try {
      // if (ballot.status /*!== 'building'*/) {
      //   throw new Error('You cannot delete a ballot that has already been deployed');
      // }

      await this.ballotService.deleteBallot(ballot);

    } catch (err) {
      this.toast.error(err.message);
    }
  }

  async togglePulse(ballot: any) {
    ballot.showPulse = !ballot.showPulse;

    if (!ballot.showPulse) {
      // const results = await this.manager.getResults(ballot);
      // ballot.currentResults = results;
    }
  }

  selfRegister(ballot) {

    // this.manager.registerSelf(ballot)

    //   .then((res) => {

    //     console.log('Register', res);

    //     this.toast.info(`You are registered to vote with pin: ${res.pin}`);

    //     return this.ballotService.updateBallot(ballot);

    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.toast.error('Unable to register you to vote.');
    //   });

  }

  activateBallot(ballot) {

    // Show spinner
    ballot.showingSpinner = true;
    ballot.status = 'activating';
    this.ballotService.updateBallot(ballot);

    // this.manager.activateBallot(ballot)

    //   .then((res) => {

    //     console.log('Ballot activated', res);

    //     ballot.tx = res;
    //     ballot.status = 'activated';

    //     // Mark as activated
    //     return this.ballotService.updateBallot(ballot);

    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.toast.error('Unable to activate your ballot. Please check your funding source.');

    //     // Hide spinner
    //     ballot.showingSpinner = false;
    //     ballot.status = 'created';
    //     this.ballotService.updateBallot(ballot);

    //   });

  }


  deployBallot(ballot) {

    // Show spinner
    ballot.showingSpinner = true;

    // Create ballot with 20 pins
    // this.manager.createBallot(ballot.json, 20)

    //   .then((res) => {

    //     console.log('Ballot submitted', res);

    //     ballot.ipfs = res.ipfs;
    //     ballot.pins = res.pins;
    //     ballot.tx = res.tx;
    //     ballot.status = 'submitted';

    //     // Mark as submitted
    //     return this.ballotService.updateBallot(ballot);

    //   })
    //   .then(() => {

    //     console.log('Ballot updated');

    //     return this.manager.getBallotStatus(ballot.tx)

    //       .then((receipt) => {

    //         console.log('Receipt', receipt);

    //         // Hide spinner
    //         ballot.showingSpinner = false;

    //         ballot.address = receipt.contractAddress;
    //         ballot.status = 'created';
    //         return this.ballotService.updateBallot(ballot);

    //       });
    //     // .then(() => {

    //     //   return this.manager.payBallot(ballot.address, ballot.type, this.manager.blockchain.web3.toWei(0.25, 'ether'));

    //     // })
    //     // .then((whatisthis) => {
    //     //   console.log('whatisthis', whatisthis);
    //     //   return whatisthis;
    //     // });

    //   })
    //   .catch((err) => {
    //     this.toast.error('Unable to deploy your ballot. Please check your funding source.');

    //      // Hide spinner
    //      ballot.showingSpinner = false;
    //      ballot.status = 'building';
    //      this.ballotService.updateBallot(ballot);
    //   });
  }

  ngOnInit() {

    this.testJson = {
      "type": "registerable",
      "ballotTitle": "Fulton County Ballot",
      "ballotLocation": "Fulton County",
      "ballotDate": "2017-11-07",
      "ballotImage": "/assets/temp/test-image-6.jpg",
      "ballotInformation": null,
      "ballotGroups": [
        {
          "groupTitle": "City of Alpharetta",
          "ballotSections": [
            {
              "sectionTitle": "City Council",
              "sectionNote": "Post 2",
              "ballotItems": [
                {
                  "itemTitle": "Ben Burnett",
                  "itemDescription": ""
                },
                {
                  "itemTitle": "Ben H. Easterling",
                  "itemDescription": null
                }
              ]
            }
          ]
        },
        {
          "groupTitle": "City of Atlanta",
          "ballotSections": [
            {
              "sectionTitle": "Mayor",
              "sectionNote": "",
              "ballotItems": [
                {
                  "itemTitle": "Peter Aman",
                  "itemDescription": ""
                },
                {
                  "itemTitle": "Rohit Ammanamanchi",
                  "itemDescription": null
                },
                {
                  "itemTitle": "Keisha Lance Bottoms",
                  "itemDescription": null
                },
                {
                  "itemTitle": "John H. Eaves",
                  "itemDescription": null
                },
                {
                  "itemTitle": "Vincent Fort",
                  "itemDescription": null
                }
              ]
            }
          ]
        }
      ]
    };

  }
}
