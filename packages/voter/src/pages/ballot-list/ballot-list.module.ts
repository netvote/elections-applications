import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TranslateModule} from "@ngx-translate/core";
import {BallotListPage} from './ballot-list';
import {ExpandableComponent} from '../../components/expandable/expandable';
import {RevealSlideableComponent} from '../../components/reveal-slideable/reveal-slideable';

@NgModule({
  declarations: [
    BallotListPage,
    ExpandableComponent,
    RevealSlideableComponent
  ],
  imports: [
    IonicPageModule.forChild(BallotListPage),
    TranslateModule.forChild()
  ],
})
export class BallotListPageModule {}
