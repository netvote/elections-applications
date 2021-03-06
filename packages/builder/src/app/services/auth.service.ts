import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {FirestoreService} from './firestore.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {User, Org, OrgUser, Transaction} from '@netvote/core';
import {v4 as uuid} from 'uuid';
import * as async from 'async';
import {Web3Service} from './web3.service';

@Injectable()
export class AuthService {

  user: Observable<User>;
  currentUser: User;
  currentOrg: Org;

  authState: any = null;

  get uid(): string {
    return this.authState ? this.authState.uid : null;
  }

  constructor(
    private web3: Web3Service,
    private db: FirestoreService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient) {

    // Observe authstate and emit other db user observable
    this.user = this.afAuth.authState.switchMap((fbuser) => {

      if (!fbuser) {
        this.unestablishUser();
        return Observable.of(null);
      }

      const ob: Observable<User> = Observable.create(observer => {

        this.establishUser(fbuser).then(userorg => {
          observer.next(userorg.user);
          observer.complete();
        });

      });

      return ob;

    });
  }

  async getIdToken(): Promise<string> {
    if(this.currentUser)
      return await this.currentUser.fb.getIdToken(true);
    else
      return null;
  }

  getEthAccounts(): Observable<any> {
    return this.web3.getAccounts();
  }

  signOut(navigate = false): void {
    this.afAuth.auth.signOut().then(() => {
      if (navigate)
        this.router.navigate(['/']);
    });
  }

  ethSignUp(email: string, firstName: string, lastName: string) {

    let uid: string = null;
    let orgid: string = null;
    let userRef: any = null;
    let orgRef: any = null;

    return this.ethLogin()

      .then((fbuser) => {
        userRef = fbuser;
        return userRef.updateEmail(email);
      })
      .then(() => {
        return userRef.updateProfile({displayName: `${firstName} ${lastName}`});
      })
      .then(() => {
        return this.createUserMeta(userRef, email, `${firstName} ${lastName}`);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  private unestablishUser() {
    this.currentUser = null;
    this.currentOrg = null;
    this.authState = null;
  }

  private createUserMeta(fbuser: firebase.User, email: string = null, displayName: string = null): Promise<any> {

    let uid: string = null;
    let orgid: string = null;
    let userRef: any = null;
    let orgRef: any = null;

    return new Promise<any>((resolve, reject) => {

      uid = fbuser.uid;
      const data = {
        uid: fbuser.uid,
        email: email || fbuser.email,
        displayName: displayName || fbuser.displayName
      };

      this.db.exists<User>(`user/${fbuser.uid}`).then((exists) => {
        if (exists) {
          return resolve();
        }
        else {
          this.db.set<User>(`user/${fbuser.uid}`, data as User)
            .then(() => {
              const org = {
                slug: uuid(),
                displayName: displayName || fbuser.displayName
              };
              return this.db.add<OrgUser>('org', org as Org);
            })
            .then((orgref) => {

              orgid = orgref.id;
              orgRef = orgref;

              const orguser = {
                uid: uid,
                orgid: orgref.id,
                roles: ['admin']
              };
              return this.db.add<OrgUser>('orguser', orguser as OrgUser);
            })
            .then((orguser) => {
              return this.db.update<User>(`user/${uid}`, {currentOrg: orgRef});
            })
            .then(()=>{
              return resolve();
            })
            .catch((error) => {
              return reject(error);
            });
        }
      });
    });
  }

  private establishUser(fbuser: firebase.User) {

    return new Promise<{user: User, org: Org}>((resolve, reject) => {

      async.waterfall([
        // Get the attached user
        (cb) => {

          this.db.docWithRefs$<User>(`user/${fbuser.uid}`).subscribe((user) => {
            this.currentUser = user;
            user.fb = fbuser;
            return cb(null, user);
          });

        },
        // Get the current org
        (user, cb) => {

          user.currentOrg.subscribe((org) => {
            this.currentOrg = org;
            return cb(null, {user: user, org: org});
          });

        }

      ], (err, res) => {
        if (err)
          return reject(err);

        return resolve({user: res['user'], org: res['org']});
      });

    });

  }

  ethLogin(): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      const web3: any = window["web3"];
      if (!web3 || !web3.eth) {
        return reject("Metamask must be installed.");
      }

      const acct = web3.eth.accounts[0];

      console.log("Logging in with: ", acct);

      // Get remote token
      this.getEthChallenge(acct).subscribe((unsigned: string) => {

        console.log("Challenge: ", unsigned);

        const params = [unsigned, acct];
        const method = 'personal_sign';

        web3.currentProvider.sendAsync({
          method,
          params,
          acct
        }, async (err, res) => {
          if (err) {
            return reject(err);
          }
          if (res.error) {
            return reject(res.error);
          }
          const signed = res.result;
          console.log("Signed Challenge: ", signed);

          this.getEthVerificationToken(unsigned, signed).subscribe((token: string) => {
            console.log("Token: ", token);

            return this.afAuth.auth.signInWithCustomToken(token)
              .then((fbuser) => {
                return resolve(fbuser);
              });

          });

        });

      });

    });

  }

  googleLogin(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider): Promise<any> {
    return this.afAuth.auth.signInWithPopup(provider).then((credential) => {

      const userRef = credential.user;
      return this.createUserMeta(userRef);

    })
  }

  private getEthVerificationToken(unsigned: string, signed: string): Observable<Object> {
    return this.http.post(`https://netvote2.firebaseapp.com/eth/auth/${unsigned}/${signed}`, null, {responseType: 'text'});
  }

  private getEthChallenge(account: string): Observable<Object> {
    return this.http.post(`https://netvote2.firebaseapp.com/eth/auth/${account}`, null, {responseType: 'text'});
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  private updateUserData(user, isnew = false) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${user.uid}`);

    if (isnew) {
      const data = {
        uid: user.uid,
        email: user.email || null,
        photoUrl: user.photoUrl || null,
        displayName: user.displayName || null,
        role: 'public' as string
      };

      const mapped: User = data as User;

      return userRef.set(mapped);
    } else {
      return userRef;
    }

  }

}
