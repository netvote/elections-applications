import {Injectable} from '@angular/core';
import {FirestoreService} from './firestore.service';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {Ballot} from '@netvote/core';

@Injectable()
export class BallotService {

  constructor(private auth: AuthService, private db: FirestoreService) {
    console.log('New Ballot Service');
  }

  getOrgBallots(): Observable<Ballot[]> {

    if (!this.auth.currentOrg)
      return Observable.of([]);

    return this.db.collectionWithIds$<Ballot>('ballot', ref => ref.where('orgid', '==', this.auth.currentOrg.id));

  }

  // TODO: Only if the user matches currently logged in user
  getBallot(id: string): Observable<Ballot> {
    return this.db.document$<Ballot>(`ballot/${id}`);
  }

  createBallot(ballot: Ballot) {

    if (!this.auth.currentOrg)
      return Promise.resolve(null);

    ballot.orgid = this.auth.currentOrg.id;

    return this.db.add<Ballot>('ballot', ballot);

  }

  updateBallot(ballot: Ballot) {
    
    if (!this.auth.currentOrg) {
      return Promise.resolve(null);
    }

    return this.db.update<Ballot>(`ballot/${ballot.id}`, ballot);

  }

  deleteBallot(ballot: Ballot) {

    if (!this.auth.currentOrg) {
      return Promise.resolve(null);
    }

    return this.db.delete<Ballot>(`ballot/${ballot.id}`);
    
  }

}
