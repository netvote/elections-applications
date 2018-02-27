import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BallotResultsPage} from './ballot-results';
import {TranslateModule} from "@ngx-translate/core";
import {ResultsChartComponent} from "../../components/results-chart/results-chart";

import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    BallotResultsPage,
    ResultsChartComponent,
    ComponentsModule
  ],
  imports: [
    IonicPageModule.forChild(BallotResultsPage),
    TranslateModule.forChild()
  ],
})
export class BallotResultsPageModule {
}
