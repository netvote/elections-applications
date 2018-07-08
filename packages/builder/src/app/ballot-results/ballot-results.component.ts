import {Component, OnInit} from '@angular/core';
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
  pieChartLabels:string[];
  isDataAvailable:boolean = false;
  sectionResults: any;

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
                //console.log("THE RESULTS", results);
                
                let sectionIdx = 0;
                json.ballotGroups.forEach((group, index) => {
                  group.ballotSections.forEach((section, index) => {

                    const pieCounts = [];
                    const pieLabels = [];

                    section.ballotItems.forEach((item, index) => {
                      item.result = {};
                      item.result.counts = results[sectionIdx][item.itemTitle];
                      item.result.group = group;
                      item.result.section = section;

                      pieLabels.push(item.itemTitle);
                      pieCounts.push(item.result.counts);
                      
                    });

                    // Create counts and labels on section object that is passed to chart component
                    section.pieCounts = pieCounts;
                    section.pieLabels = pieLabels;

                    sectionIdx++;
                    
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
}
