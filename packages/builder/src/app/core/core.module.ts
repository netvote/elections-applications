import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthService} from '../services/auth.service';
import {Web3Service} from '../services/web3.service';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {FirestoreService} from '../services/firestore.service';
import {BallotService} from '../services/ballot.service';
import {ToastService} from '../services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService, Web3Service, FirestoreService, BallotService, ToastService],
  declarations: []
})
export class CoreModule {}
