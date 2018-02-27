import { NgModule } from '@angular/core';
import { ExpandableComponent } from './expandable/expandable';
import {SpinnerComponent} from "../components/spinner/spinner";

@NgModule({
	declarations: [
		ExpandableComponent,
		SpinnerComponent
	],
	imports: [],
	exports: [
		ExpandableComponent,
		SpinnerComponent
	]

})
export class ComponentsModule {}
