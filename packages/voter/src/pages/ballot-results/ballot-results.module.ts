import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotResultsPage} from './ballot-results';
import {TranslateModule} from "@ngx-translate/core";

import {ResultsChartComponent} from "../../components/results-chart/results-chart";

@NgModule({
  declarations: [
    BallotResultsPage,
    ResultsChartComponent
  ],
  imports: [
    IonicPageModule.forChild(BallotResultsPage),
    TranslateModule.forChild()
  ],
})
export class BallotResultsPageModule {
}
