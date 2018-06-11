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
  deployedBallotCount: number;

  constructor( private ballotService: BallotService ) { 

    this.ballots = this.ballotService.getOrgBallots();    
  }

  ngOnInit(){
    //console.log("ballots listing : ", this.ballots);

    this.ballots.subscribe(result => {

      this.ballotCount = result.length;

      let a = 0; // activated
      let b = 0; // building
      let c = 0; // created
      for (var i in result) {

        if(result[i].status === 'activated'){
          a++;
        }

        if(result[i].status === 'building'){
          b++;
        }

        if(result[i].status === 'created'){
          c++;
        }
     }

     this.activatedBallotCount = a;

     this.buildingBallotCount = b;

     this.deployedBallotCount = c;
    
    });
  }

}
