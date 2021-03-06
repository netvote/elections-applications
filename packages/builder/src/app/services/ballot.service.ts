import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FirestoreService} from './firestore.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {Ballot, BlockchainConnection, Tally} from '@netvote/core';


@Injectable()
export class BallotService {

  blockchain: BlockchainConnection;

  constructor(private auth: AuthService,
    private db: FirestoreService,
    private afs: AngularFirestore,
    private http: HttpClient) {
    this.blockchain = new BlockchainConnection();
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

  async deployBallot(ballot: Ballot) {

    const ipfs = this.blockchain.getIPFSConnection();
    const address = await ipfs.p.addJSON(ballot.json);
    const info = await this.submitBallot(address, ballot.network, ballot.type);

    if (info.txId) {
      ballot.createTxId = info.txId;
      ballot.createCollection = info.collection;
      await this.updateBallot(ballot);
    }

    return info;

  }

  getBallotObservable(path: string, id: string): Observable<Ballot> {
    const itemDoc = this.afs.doc<Ballot>(`${path}/${id}`);
    return itemDoc.valueChanges();
  }

  // TODO: Push to common
  getTally(address: string): Observable<Tally> {

    return Observable.create(observer => {
      this.http.get(`https://netvote2.firebaseapp.com/tally/election/${address}`)
        .subscribe((res: any) => {
          const txId = res.txId;
          const collection = res.collection;
          const doc = this.afs.doc<Tally>(`${collection}/${txId}`);
          doc.valueChanges().subscribe((info: Tally) => {
            if (info.status === "complete") {
              observer.next(info);
              observer.complete();
            }
          });

        });
      return () => {}
    });
  }

  submitBallot(ipfs: string, network: string, type: string): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      this.auth.getIdToken().then((token) => {

        const body = {
          'autoActivate': true,
          'metadataLocation': ipfs,
          'allowUpdates': true,
          'isPublic': type === "public",
          'network': network
        }

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        };

        this.http.post(`https://netvote2.firebaseapp.com/admin/election/`, body, httpOptions).subscribe((res) => {
          return resolve(res);
        });

      });

    });

  }

  async getRemoteBallotMeta(ipfsKey: string): Promise<any> {

    const ipfs = this.blockchain.getIPFSConnection();
    const result = await ipfs.p.catJSON(ipfsKey);
    if (!result)
      throw new Error("Ballot meta is no longer present");

    result.ipfs = ipfsKey;

    return result;
  }

}
