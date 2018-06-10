import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FirestoreService} from './firestore.service';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {Ballot, BlockchainConnection} from '@netvote/core';

@Injectable()
export class BallotService {

  blockchain: BlockchainConnection;

  constructor(private auth: AuthService,
    private db: FirestoreService,
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

    // Need to rename a couple of properties until made consistent
    ballot.json.featuredImage = ballot.json.ballotImage;
    ballot.json.type = ballot.json.ballotType;
    ballot.json.description = ballot.json.ballotTitle;
    console.log(ballot.json);

    const ipfs = this.blockchain.getIPFSConnection();
    ipfs.p.addJSON(ballot.json).then(async (address) => {

      await this.submitBallot(address)

      // const meta = await this.getRemoteBallotMeta(ipfs);
      // console.log(meta);
    });

  }

  async submitBallot(ipfs) {

    const token = await this.auth.getIdToken();

    console.log(token);

    const body = {
      'autoActivate': true,
      'metadataLocation': ipfs,
      'allowUpdates': true,
      'isPublic': true
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    this.http.post(`https://netvote2.firebaseapp.com/admin/election/`, body, httpOptions).subscribe((something)=>{
      console.log(something);
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
