import {Component, ViewChild, ElementRef, Renderer, Input } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'results-chart',
  templateUrl: 'results-chart.html'
})
export class ResultsChartComponent {

  @ViewChild('resultChart', {read: ElementRef}) resultPieChart;
  @Input('resultData') resultData;

  chart: any;

  constructor(public renderer: Renderer) {}

  ngAfterViewInit(){
    
    const results = [];
    let opacity = 1.00;
    this.resultData.ballotItems.forEach((item, index) => {
      results.push({
        label: item.itemTitle,
        backgroundColor: `rgba(95, 192, 189, ${opacity})`,
        data: [item.result.counts]
      });
      opacity-=.3;

    });

    console.log(results);

    this.chart = new Chart(this.resultPieChart.nativeElement, {

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
