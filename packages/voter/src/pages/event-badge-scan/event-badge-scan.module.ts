import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EventBadgeScanPage} from './event-badge-scan';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    EventBadgeScanPage,
  ],
  imports: [
    IonicPageModule.forChild(EventBadgeScanPage),
    TranslateModule.forChild()
  ],
})
export class EventBadgeScanPageModule {
}
