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
  // lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // nv green
      backgroundColor: 'rgba(100, 190, 188, 0.2)',
      borderColor: 'rgba(100, 190, 188, 1.00)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // nv blue
      backgroundColor: 'rgba(17, 55, 74, 0.2)',
      borderColor: 'rgba(17, 55, 74, 1.00)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
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
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }



  // TEST Pie Chart
  public pieChartLabels:string[] = ['Candidate 1', 'Candidate 2', 'Candidate 3'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';
  public pieChartOptions:any = {
    responsive: true
  };
  public pieChartColors:Array<any> = [{ backgroundColor: [
    'rgba(100, 190, 188, 1.00)', 
    "rgba(17, 55, 74, 1.00)", 
    "rgba(148,159,177,1)"] 
  }];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
