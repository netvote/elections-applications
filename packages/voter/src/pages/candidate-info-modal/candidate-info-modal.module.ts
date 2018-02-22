import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CandidateInfoModalPage } from './candidate-info-modal';

@NgModule({
  declarations: [
    CandidateInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CandidateInfoModalPage),
  ],
})
export class CandidateInfoModalPageModule {}
