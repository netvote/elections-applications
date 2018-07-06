import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Ballot} from '../../models/ballot';

// TODO: Refactor storage completely
@Injectable()
export class BallotProvider {

  readonly STORAGE_KEY = "ballots_2";
  
  private _ballots: Ballot[];

  constructor(private storage: Storage) {
  }

  async getBallots(predicate?: (ballot: Ballot) => void, iteratee?: (ballot: Ballot) => void): Promise<Ballot[]> {
    await this._loadBallots();
    return this._ballots.sort((b1: Ballot, b2: Ballot) => {return b2.timestamp.getTime() - b1.timestamp.getTime()});
  }

  async getBallot(address: string, id: string): Promise<Ballot> {
    await this._loadBallots();
    return this._ballots.find((ballot: Ballot) => {
      return ballot.address === address && ballot.id === id;
    });
  }

  async addBallot(ballot: Ballot): Promise<Ballot> {
    await this._loadBallots();
    ballot.timestamp = new Date();
    this._ballots.push(ballot);
    await this._save();
    return ballot;
  }

  async removeBallot(address: string, id: string): Promise<Ballot[]> {
    await this._loadBallots();
    this._ballots = this._ballots.filter((ballot: Ballot) => {
      return ballot.address !== address || ballot.id !== id;
    });
    await this._save();
    return this._ballots;
  }

  // TODO: Whitelist input attributes
  async updateBallot(address: string, id: string, update: any): Promise<Ballot> {
    await this._loadBallots();
    let ballot = await this.getBallot(address, id);
    if(ballot){
      const merged = {...ballot, ...update};
      merged.timestamp = new Date();
      await this.removeBallot(address, id);
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
    for (let ballot of ballots) {
      ballot.timestamp = new Date(ballot.timestamp);
    }
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


