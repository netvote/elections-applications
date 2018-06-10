import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

declare var window: any;

@Injectable()
export class Web3Service {

  public web3: any;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3 = window.web3; //new Web3(window.web3.currentProvider);
    }
  }

  getAccounts(): Observable<string[]> {
    return Observable.create(observer => {
      this.web3.eth.getAccounts((err, accs: string[]) => {
        if (err != null) {
          observer.error('Unable to get accounts.')
        }

        if (accs.length === 0) {
          observer.error('No accounts available.')
        }

        observer.next(accs)
        observer.complete()
      });
    })
  }
}
