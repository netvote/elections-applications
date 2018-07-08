import {Component, OnInit, ElementRef} from '@angular/core';
import {BallotService} from '../services/ballot.service';
import {Ballot} from '@netvote/core';
import {Observable} from 'rxjs/Observable';
import {ToastService} from '../services/toast.service';
import {ConfirmService, ConfirmState, ConfirmTemplateDirective, ConfirmModalComponent} from '../services/confirm-modal-and-service.service';
import {SpinnerService} from '@chevtek/angular-spinners';

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
    private confirmService: ConfirmService,
    private elementRef: ElementRef,
    private toast: ToastService) {

    //this.manager = new BallotManager();
    this.ballots = this.ballotService.getOrgBallots();

  }

  toggleQR(ballot) {
    ballot.showQR = !ballot.showQR;
  }

  async getMetrics(ballot) {

  }

  registerSelf(ballot: Ballot) {

  }

  voteInBallot(ballot: Ballot, counts: number[]) {

  }

  deleteBallot(ballot) {
    this.confirmService.confirm({title: 'Delete Ballot', message: 'Are you sure you want to delete this ballot?'}).then(
      () => {

        //console.log('deleting...');

        try {

          this.ballotService.deleteBallot(ballot).then(() => {
            this.toast.info('Ballot ' + ballot.title + ' has been deleted.');
          });

        } catch (err) {
          this.toast.error(err.message);
        }

      },
      () => {
        //console.log('not deleting...');
      });
  }

  async togglePulse(ballot: any) {
    ballot.showPulse = !ballot.showPulse;

    if (!ballot.showPulse) {
      // const results = await this.manager.getResults(ballot);
      // ballot.currentResults = results;
    }
  }

  selfRegister(ballot) {

  }

  activateBallot(ballot) {

    // Show spinner
    ballot.showingSpinner = true;
    ballot.status = 'activating';
    this.ballotService.updateBallot(ballot);


  }


  deployBallot(ballot) {

    // Show spinner
    ballot.showingSpinner = true;

  }

  ngOnInit() {

  }
}
