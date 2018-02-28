import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TranslateModule} from "@ngx-translate/core";
import { ExpandableComponent } from './expandable/expandable';
import {SpinnerComponent} from "../components/spinner/spinner";
import {ResultsChartComponent} from "../components/results-chart/results-chart";
import {TutorialComponent} from '../components/tutorial/tutorial';
@NgModule({
	declarations: [
		ExpandableComponent,
		SpinnerComponent,
		ResultsChartComponent,
		TutorialComponent
	],
	imports: [
		IonicPageModule, 
		TranslateModule.forChild()
	],
	exports: [
		ExpandableComponent,
		SpinnerComponent,
		ResultsChartComponent,
		TutorialComponent
	]

})
export class ComponentsModule {}
