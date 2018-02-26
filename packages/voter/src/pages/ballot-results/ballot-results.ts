import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ModalController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NetvoteProvider} from '../../providers/netvote/netvote';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';

import { Chart } from 'chart.js';

@IonicPage({
  segment: "ballot-results/:address",
  name: "ballot-results"
})
@Component({
  selector: 'page-ballot-results',
  templateUrl: 'ballot-results.html',
})
export class BallotResultsPage {

  @ViewChild(Content) content: Content;
  @ViewChild('resultPieChart', {read: ElementRef}) resultPieChart;
 
  barChart: any;
  ballot: Ballot;
  currentSelected: any = {};
  address: string;
  canEditBallot: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private netvote: NetvoteProvider,
    private ballotProvider: BallotProvider) {

    // Address of the ballot contract  
    this.address = this.navParams.get("address");
  }

  async ionViewDidEnter() {
    this.ballot = await this.ballotProvider.getBallot(this.address);
    if (!this.ballot)
      return;

    console.log(this.ballot);

    if (this.ballot.selections)
      this.currentSelected = this.ballot.selections;

    const meta = await this.netvote.getRemoteBallotMeta(this.address);

    this.ballot.meta = meta;

    this.tallyIt();

  }

  async tallyIt() {

    const res = await this.netvote.getTally(this.ballot.address);

    const ballot = res.ballots[this.address];

    if (ballot && ballot.results) {
      const results = ballot.results.ALL;
      let sectionIdx = 0;
      this.ballot.meta.ballotGroups.forEach((group, index) => {
        group.ballotSections.forEach((section, index) => {
          section.ballotItems.forEach((item, index) => {
            item.result = results[sectionIdx][item.itemTitle];
          });
          sectionIdx++;
        })

      });
    }
    
  }

  ionViewDidLoad(){

    this.barChart = new Chart(this.resultPieChart.nativeElement, {

      type: 'horizontalBar',
        data: {
          //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          // datasets: [{
          //   label: '# of Votes',
          //   data: [12, 19, 3, 5, 2, 3],
          //   backgroundColor: [
          //     'rgba(255, 99, 132, 1)',
          //     'rgba(54, 162, 235, 1)',
          //     'rgba(255, 206, 86, 1)',
          //     'rgba(75, 192, 192, 1)',
          //     'rgba(153, 102, 255, 1)',
          //     'rgba(255, 159, 64, 1)'
          //   ],
          //   borderWidth: 0
          // }]
          datasets: [{
            label: "Apples",
            backgroundColor: "rgba(95, 192, 189, 1.00)",
            data: [ (Math.random() * 100).toFixed(2) ]
          },{
            label: "Oranges",
            backgroundColor: "rgba(95, 192, 189, 0.8)",
            data: [ (Math.random() * 100).toFixed(2) ]
          },{
            label: "Mangos",
            backgroundColor: "rgba(95, 192, 189, 0.6)",
            data: [ (Math.random() * 100).toFixed(2) ]
          },{
            label: "Avocados",
            backgroundColor: "rgba(95, 192, 189, 0.4)",
            data: [ (Math.random() * 100).toFixed(2) ]
          }]
        },
        options: {
          layout: {
            padding: {
              left: 0,
              right: 20,
              top: 0,
              bottom: 0
            }
          },
          legend: {
            display: true,
            usePointStyle: true,
            position: 'bottom',
            labels: {
              boxWidth: 10,
              fontColor: 'rgb(255, 255, 255)'
            }
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: "# of votes",
                fontColor: 'rgba(255,255,255, 0.8)'
              },
              gridLines: {
                zeroLineColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                fontColor: 'rgba(255,255,255, 0.8)',
                beginAtZero: true
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: false
              },
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: 'rgba(255,255,255, 0.8)',
                beginAtZero: true
              }
            }]
          }
        }
    });
    
  }

}
