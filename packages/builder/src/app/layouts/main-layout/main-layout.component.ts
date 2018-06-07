import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BallotService} from '../../services/ballot.service';
import {Ballot} from '@netvote/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

  ballots: Observable<Ballot[]>;
  ballotCount: number;
  buildingBallotCount: number;
  activatedBallotCount: number

  constructor( private ballotService: BallotService ) { 

    this.ballots = this.ballotService.getOrgBallots();    
  }

  ngOnInit(){
    //console.log("ballots listing : ", this.ballots);

    this.ballots.subscribe(result => {

      this.ballotCount = result.length;

      let j = 0;
      for (var i in result) {
        if(result[i].status === 'building'){
          j++;
        }
     }

     this.buildingBallotCount = j;
    
     this.activatedBallotCount = 0;
    
    });
  }

}
