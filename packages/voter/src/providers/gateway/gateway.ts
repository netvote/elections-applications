import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

export interface VoteTransaction { 
  address: string;
  encryptedVote: string;
  status: string;
  tx: string;
  voteId: string; 
}

@Injectable()
export class GatewayProvider {

  constructor(public afs: AngularFirestore) {
  }

  getVoteObservable(path: string, id: string): Observable<VoteTransaction> {
    const itemDoc = this.afs.doc<VoteTransaction>(`${path}/${id}`);
    return itemDoc.valueChanges();
  }

}
