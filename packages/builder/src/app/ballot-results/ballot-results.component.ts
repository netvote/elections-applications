import { Component, OnInit } from '@angular/core';
import {BallotService} from '../services/ballot.service';
import {Ballot, Tally} from '@netvote/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ballot-results',
  templateUrl: './ballot-results.component.html',
  styleUrls: ['./ballot-results.component.scss']
})
export class BallotResultsComponent implements OnInit {

  ballot: Ballot = null;
  pieChartData:Array<any>;
  pieChartType:string = 'pie';
  pieChartLabels:string[];
  isDataAvailable:boolean = false;

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
          .subscribe((ballot: any) => {
            const json = ballot.json;
            this.ballot = ballot;
            
            this.ballotService.getTally(this.ballot.electionAddress).subscribe((tally: Tally)=>{
              const resultData = JSON.parse(tally.results);
              const results = resultData.ballots[Object.keys(resultData.ballots)[0]].results.ALL;

              if(results.length > 0){
                console.log("THE RESULTS", results);
                
                let sectionIdx = 0;
                json.ballotGroups.forEach((group, index) => {
                  group.ballotSections.forEach((section, index) => {
                    const pieResults = [];
                    const pieLabels = [];
                    section.ballotItems.forEach((item, index) => {
                      item.result = {};
                      item.result.counts = results[sectionIdx][item.itemTitle];
                      item.result.group = group;
                      item.result.section = section;

                      pieLabels.push(item.itemTitle);
                      pieResults.push({
                        label: item.itemTitle,
                        data: [item.result.counts]
                      });
                      
                      // console.log('PIE CHART DATA ', this.pieChartData);

                    });
                    this.pieChartData = pieResults;
                    this.pieChartType = 'pie';
                    this.pieChartLabels = pieLabels;
                    sectionIdx++;
                    console.log('PIE CHART DATA ', this.pieChartData);
                    console.log('PIE CHART LABELS ', this.pieChartLabels);
                  })
          
                });
              }
              
              
              // At this point, each item now has a result property with the counts. This is the same as in the mobile app
              this.isDataAvailable = true;
              console.log("Tally:", ballot);
              
              
            });
          });
      }
      
    });

  }

  // Test PIE Chart
  //public pieChartType:string = 'pie';
  public pieChartOptions:any = {
    responsive: true,
    legend: {position: 'bottom'}
  };
  public pieChartLegend:boolean = true;
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

  // // TEST BAR CHART DATA
  // public barChartOptions:any = {
  //   scaleShowVerticalLines: false,
  //   responsive: true
  // };
  // public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // public barChartType:string = 'bar';
  // public barChartLegend:boolean = true;
  // public barChartColors:Array<any> = [
  //   { // nv green
  //     backgroundColor: '#64BEBC',
  //     borderColor: '#64BEBC'
  //   },
  //   { // nv blue
  //     backgroundColor: '#11374A',
  //     borderColor: '#11374A'
  //   },
  //   { // grey
  //     backgroundColor: 'rgba(148,159,177,0.2)',
  //     borderColor: 'rgba(148,159,177,1)'
  //   }
  // ];
 
  // public barChartData:any[] = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  // ];
 
  // // events
  // public chartClicked(e:any):void {
  //   console.log(e);
  // }
 
  // public chartHovered(e:any):void {
  //   console.log(e);
  // }

 
}
