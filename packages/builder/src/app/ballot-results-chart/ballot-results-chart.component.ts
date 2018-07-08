import {Component, ViewChild, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'ballot-results-chart',
  templateUrl: './ballot-results-chart.component.html',
  styleUrls: ['./ballot-results-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BallotResultsChartComponent implements OnInit{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input('pieCounts') pieCounts;
  @Input('pieLabels') pieLabels;

  //chart: any;
  pieChartData:number[];
  pieChartLabels:string[];
  pieChartType:string = 'pie';
  pieChartOptions:any = {
    responsive: true,
    legend: {position: 'bottom'}
  };
  pieChartLegend: boolean = true;
  pieChartColors: Array<any> = [{
    backgroundColor: [
      'rgba(100, 190, 188, 1.00)',
      "rgba(17, 55, 74, 1.00)",
      "rgba(148,159,177,1)"]
  }];

  constructor() {}
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ngOnInit(){    

    this.pieChartData = this.pieCounts;
    this.pieChartLabels = this.pieLabels;

  // setTimeout(() => {
  //   console.log("3 second timeout");
    
  //   this.chart.chart.update();

  // }, 3000);

  }

}
