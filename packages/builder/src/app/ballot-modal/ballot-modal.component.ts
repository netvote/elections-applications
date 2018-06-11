import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '@chevtek/angular-spinners';

@Component({
  selector: 'nv-ballot-modal',
  templateUrl: './ballot-modal.component.html',
  styleUrls: ['./ballot-modal.component.scss']
})
export class BallotModalComponent implements OnInit {

  @Input() modalText;

  constructor(
    public activeModal: NgbActiveModal,
    public spinnerService: SpinnerService
  ) { }

  ngOnInit() {
  }

}