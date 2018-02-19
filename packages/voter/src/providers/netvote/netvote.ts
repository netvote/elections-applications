import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import * as protobuf from 'protobufjs';
import * as tally from '@netvote/elections-tally';

import {SecureStorage, SecureStorageObject} from "@ionic-native/secure-storage";
import {BallotFactory, BlockchainConnection} from '@netvote/core';
import {ConfigurationProvider} from '../configuration/configuration';

export declare var lightwallet: any;

@Injectable()
export class NetvoteProvider {

  blockchain: BlockchainConnection;

  constructor(
    public config: ConfigurationProvider,
    public http: Http,
    private secureStorage: SecureStorage) {
    this.blockchain = new BlockchainConnection();
  }

  // Using ipfs address, get ballot meta
  public async getRemoteBallotMeta(address: string): Promise<any> {

    const BallotContract = BallotFactory.getMeta("public");
    const contract = this.blockchain.getContract(BallotContract.abi, address);
    const ref = await contract.metadataLocation();
    if (!ref)
      throw new Error("Missing IPFS Reference in Smart Contract");

    const ipfsKey = ref[0].toString();

    const ipfs = this.blockchain.getIPFSConnection();
    const result = await ipfs.p.catJSON(ipfsKey);
    if (!result)
      throw new Error("Ballot meta is no longer present");

    result.ipfs = ipfsKey;

    return result;
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
        return resolve(res);
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

      // TODO: Config
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

  public async getTransaction(tx: string) {
    return this.blockchain.getTransaction(tx);
  }

  public getTally(address: string): Promise<any> {

    const baseUrl = this.config.base.paths.infuraBase;

    return tally.tally({
      electionAddress: address,
      provider: baseUrl,
      protoPath: 'assets/proto/vote.proto',
      resultsUpdateCallback: (resultsStatusObj) => {
      }
    });

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
