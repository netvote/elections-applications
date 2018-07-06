import {Component, ViewChild, ElementRef, Renderer, Input } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'ballot-results-chart',
  templateUrl: './ballot-results-chart.component.html',
  styleUrls: ['./ballot-results-chart.component.scss']
})
export class BallotResultsChartComponent {

  @ViewChild('resultChart', {read: ElementRef}) resultPieChart;
  @Input('resultData') resultData;

  chart: any;

  constructor(public renderer: Renderer) {}

  ngAfterViewInit(){
    
    const results = [];
    let opacity = 1.00;
    this.resultData.ballotItems.forEach((item, index) => {
      console.log(item.result);
      
      results.push({
        label: item.itemTitle,
        backgroundColor: `rgba(95, 192, 189, ${opacity})`,
        data: [item.result.counts]
      });
      opacity-=.3;

    });

    // Test PIE Chart
    // public pieChartLabels:string[] = ['Candidate 0', 'Candidate 2', 'Candidate 3'];
    // public pieChartData:number[] = [300, 500, 100];
    // public pieChartType:string = 'pie';
    // public pieChartOptions:any = {
    //   responsive: true,
    //   legend: {position: 'bottom'}
    // };
    // public pieChartColors:Array<any> = [{ backgroundColor: [
    //   'rgba(100, 190, 188, 1.00)', 
    //   "rgba(17, 55, 74, 1.00)", 
    //   "rgba(148,159,177,1)"] 
    // }];






    this.chart = new Chart(this.resultPieChart.nativeElement, {

      type: 'horizontalBar',
        data: {
          datasets: results
        },
        options: {
          layout: {
            padding: {
              left: 5,
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
              maxBarThickness: 20,
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