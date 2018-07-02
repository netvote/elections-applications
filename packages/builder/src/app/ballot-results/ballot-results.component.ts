import { Component, OnInit } from '@angular/core';
import {BallotService} from '../services/ballot.service';
import {Ballot} from '@netvote/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ballot-results',
  templateUrl: './ballot-results.component.html',
  styleUrls: ['./ballot-results.component.scss']
})
export class BallotResultsComponent implements OnInit {

  ballot: Ballot = null;

  constructor( 
    private ballotService: BallotService,
    private route: ActivatedRoute,
    private router: Router) { 

  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      if (params['id']) {
        this.ballot = null;
        this.ballotService.getBallot(params['id'])
          .subscribe((ballot) => {
            const json = ballot.json;
            this.ballot = ballot;
            console.log(this.ballot);
          });
      }

    });

  }

  // TEST BAR CHART DATA
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartColors:Array<any> = [
    { // nv green
      backgroundColor: '#64BEBC',
      borderColor: '#64BEBC'
    },
    { // nv blue
      backgroundColor: '#11374A',
      borderColor: '#11374A'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)'
    }
  ];
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
