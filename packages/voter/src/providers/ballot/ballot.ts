import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Ballot} from '../../models/ballot';

@Injectable()
export class BallotProvider {

  readonly STORAGE_KEY = "ballots1.0";
  readonly UNIQUE_KEY = "address";

  private _ballots: Ballot[];

  constructor(private storage: Storage) {
  }

  async getBallots(predicate?: (ballot: Ballot) => void, iteratee?: (ballot: Ballot) => void): Promise<Ballot[]> {
    await this._loadBallots();
    if (!predicate && !iteratee)
      return this._ballots;
    return this._ballots;
  }

  async getBallot(address: string): Promise<Ballot> {
    await this._loadBallots();
    return this._ballots.find((ballot: Ballot) => {
      return ballot.address === address;
    });
  }

  async addBallot(ballot: Ballot): Promise<Ballot> {
    await this._loadBallots();
    ballot.timestamp = new Date();
    this._ballots.push(ballot);
    await this._save();
    return ballot;
  }

  async removeBallot(address: string): Promise<Ballot[]> {
    await this._loadBallots();
    this._ballots = this._ballots.filter((ballot: Ballot) => {
      return ballot.address !== address;
    });
    await this._save();
    return this._ballots;
  }

  // TODO: Whitelist input attributes
  async updateBallot(address: string, update: any): Promise<Ballot> {
    await this._loadBallots();
    let ballot = await this.getBallot(address);
    if(ballot){
      const merged = {...ballot, ...update};
      merged.timestamp = new Date();
      await this.removeBallot(address);
      await this.addBallot(merged);
      ballot = merged;
    }
    return ballot;
  }

  async clear(): Promise<any> {
    return await this.storage.set(`${this.STORAGE_KEY}`, []);
  }

  private _clean(ballots: any): Ballot[] {
    if (!Array.isArray(ballots))
      return [];
    return ballots;
  }

  private async _save(): Promise<any> {
    return await this.storage.set(`${this.STORAGE_KEY}`, this._ballots);
  }

  private async _loadBallots(): Promise<any> {
    const ret = await this.storage.get(`${this.STORAGE_KEY}`);
    this._ballots = this._clean(ret);
  }

}


