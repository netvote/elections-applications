import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as protobuf from 'protobufjs';
import * as jwtdecode from 'jwt-decode'
import * as  URL from 'url-parse';

import {SecureStorage, SecureStorageObject} from "@ionic-native/secure-storage";
import {BlockchainConnection, Tally} from '@netvote/core';
import {ConfigurationProvider} from '../configuration/configuration';
import {BallotProvider} from '../../providers/ballot/ballot';
import {Ballot} from '../../models/ballot';

export declare var lightwallet: any;

export interface VoteTransaction {
  address: string;
  encryptedVote: string;
  status: string;
  tx: string;
  voteId: string;
}

export interface DeployedElection {
  demo: boolean;
  metadataLocation: string;
  network: string;
  version: string;
  resultsAvailable: boolean;
}

@Injectable()
export class NetvoteProvider {

  blockchain: BlockchainConnection;

  constructor(
    public afs: AngularFirestore,
    public config: ConfigurationProvider,
    private ballotProvider: BallotProvider,
    public http: Http,
    private secureStorage: SecureStorage) {
    this.blockchain = new BlockchainConnection();
  }

  public getVoteObservable(path: string, id: string): Observable<VoteTransaction> {
    const itemDoc = this.afs.doc<VoteTransaction>(`${path}/${id}`);
    return itemDoc.valueChanges();
  }

  // Sorry for below :/
  public getRemoteBallotMeta(address: string): Promise<any> {

    return new Promise((resolve, reject) => {

      const itemDoc = this.afs.doc<DeployedElection>(`deployedElections/${address}`);
      itemDoc.valueChanges().subscribe(async (meta: DeployedElection) => {

        const ipfs = this.blockchain.getIPFSConnection();
        const result = await ipfs.p.catJSON(meta.metadataLocation);
        if (!result)
          return reject("Ballot meta is no longer present");

        result.ipfs = meta.metadataLocation;

        return resolve(result);
      });

    });

  }

  public async ImportBallotByUrl(url: string): Promise<any> {
    try {
      const u = new URL(url);
      if (u.protocol === "netvote:") {
        const res = await this.importBallot(u.hostname, u.pathname.substring(1));
        return res;
      } else return {};
    } catch (error) {
    }
  }

  public async importBallot(address: string, jwt: string): Promise<any> {
    let id: string = null;
    if (jwt) {
      const decoded: any = jwtdecode(jwt);
      id = decoded.sub;
    }
    const meta = await this.getRemoteBallotMeta(address);
    
    let ballot = await this.ballotProvider.getBallot(address, id);
    if (ballot) {
      await this.ballotProvider.removeBallot(address, id);
    }
    ballot = new Ballot(address, id, meta.ballotTitle, meta.ipfs, meta.type, meta.ballotNetwork, meta.featuredImage);
    ballot.description = meta.description;
    ballot.token = jwt;
    await this.ballotProvider.addBallot(ballot);
    return {meta: meta, id: id, address: address, token: jwt};
  }

  public getVoterToken(ballotKey: string, ballotAddress: string) {

    const baseUrl = this.config.base.paths.gatewayBase;

    return new Promise((resolve, reject) => {

      const headers = new Headers();
      headers.append('Authorization', 'Bearer ' + ballotKey);
      var body = {"address": ballotAddress};

      this.http.post(`${baseUrl}/vote/auth`, body, {
        headers: headers,
      })
        .map((res) => res.json())
        .subscribe((res) => {
          return resolve(res.token);
        },
          (err) => {
            return reject(err);
          });

    });

  }

  public submitVote(vote: string, token: string) {

    const baseUrl = this.config.base.paths.gatewayBase;

    return new Promise((resolve, reject) => {

      const headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);
      var body = {"vote": vote};

      this.http.post(`${baseUrl}/vote/cast`, body, {
        headers: headers,
      })
        .map((res) => res.json())
        .subscribe((res) => {
          return resolve(res);
        },
          (err) => {
            return reject(err);
          });

    });
  }

  public getBallotFromCode(code: string, token: string): Promise<any> {

    const baseUrl = this.config.base.paths.gatewayBase;

    return new Promise((resolve, reject) => {

      const headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);
      var body = {"shortCode": code};

      this.http.post(`${baseUrl}/vote/ballotGroup/auth`, body, {
        headers: headers,
      })
        .map((res) => res.json())
        .subscribe((res) => {
          return resolve(res);
        },
          (err) => {
            return reject(err);
          });

    });
  }

  public postWithAuth(token: string, url: string) {

    const baseUrl = this.config.base.paths.gatewayBase;

    return new Promise((resolve, reject) => {

      const headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);

      this.http.post(url, null, {
        headers: headers,
      })
        .map((res) => res.json())
        .subscribe((res) => {
          return resolve(res);
        },
          (err) => {
            return reject(err);
          });

    });
  }

  public async getTransaction(tx: string) {
    return this.blockchain.getTransaction(tx);
  }

  // TODO: Push to common
  public getTally(address: string): Observable<Tally> {

    return Observable.create(observer => {
      this.http.get(`https://netvote2.firebaseapp.com/tally/election/${address}`)
        .map((res) => res.json())
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

  public getVote(address: string, txId: string): Observable<any> {
    return this.http.get(`https://netvote2.firebaseapp.com/vote/lookup/${address}/${txId}`)
        .map((res) => res.json())
        .map((res) => {
          res.results = JSON.parse(res.results);
          return res;
        })

  }

  // TODO: Implement
  public verifyVote() {

  }

  public async encodeVote(payload: any): Promise<string> {

    const root = await protobuf.load("assets/proto/vote.proto");
    const Vote = root.lookupType("netvote.Vote");

    const err = Vote.verify(payload);
    if (err) {
      throw Error(err);
    }

    let vote = Vote.create(payload);
    const arr = await Vote.encode(vote).finish();
    const binstr = Array.prototype.map.call(arr, (ch) => {return String.fromCharCode(ch);}).join('');
    const voteBase64 = btoa(binstr);

    return voteBase64;
  }

  public saveKeyStore(ks: any) {

    return new Promise((resolve, reject) => {

      // Get secure storage area
      this.secureStorage.create("netvote")

        .then((ss: SecureStorageObject) => {

          let serialized = ks.serialize();

          // Store in secure storage
          ss.set("keystore.1", serialized).then((res) => {
            return resolve(ks);

          }).catch((err) => {
            return reject(err.message);
          })

        })
        .catch((err) => {
          return reject(err.message);
        });

    });

  }

  public getKeyStore(password: string): any {

    return new Promise((resolve, reject) => {

      // Create a named secure storage area on device
      this.secureStorage.create("netvote")

        .then((ss: SecureStorageObject) => {

          // Try to get the keystore
          ss.get("keystore.1").then((val) => {

            // Deserialize it
            let deserialized = lightwallet.keystore.deserialize(val);

            return resolve(deserialized);

          }).catch((err) => {

            // Create a keystore
            lightwallet.keystore.createVault({
              password: password
            }, (err, ks) => {
              if (err) return reject(err.message);

              // Serialize it
              let serialized = ks.serialize();

              // Store in secure storage
              ss.set("keystore.1", serialized).then((res) => {

                return resolve(ks);

              }).catch((err) => {
                return reject(err.message);
              })

            });

          });

        })
        .catch((err) => {
          return reject(err.message);
        });

    });

  }

  public getWallet(password: string): Promise<string> {

    return new Promise((resolve, reject) => {

      // Get the key store
      this.getKeyStore(password).then((keystore) => {

        // We've already got a local wallet address so return it
        let current = keystore.getAddresses();
        if (current.length > 0)
          return resolve(current[0]);

        // We need to create a key for address generation
        keystore.keyFromPassword(password, (err, derived) => {
          if (err) throw err;

          // Create a new wallet address
          keystore.generateNewAddress(derived, 1);

          let addrs = keystore.getAddresses();

          if (addrs.length) {
            console.log("NV: New wallet generated: ", addrs);

            // Save keystore with newly generated wallet address
            this.saveKeyStore(keystore).then(() => {
              return resolve(addrs[0]);
            }).catch((err) => {
              return reject(err.message);
            });

            return resolve(addrs[0]);
          } else {
            return reject("Cannot generate wallet address");
          }

        });

      }).catch((err) => {
        return reject(err.message);
      });

    });


  }

}
