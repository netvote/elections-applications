import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BallotService} from '../services/ballot.service';
import {Ballot} from '@netvote/core';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  ballots: Observable<Ballot[]>;

  constructor(private ballotService: BallotService) {

    this.ballots = this.ballotService.getOrgBallots(); 

   }

  ngOnInit() {

    // this.ballots.subscribe(result => {

    //   console.log(result);

    // });

  }


  // TEST CHART DATA
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
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
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
