import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {FirestoreService} from './firestore.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {User, Org, OrgUser, Transaction} from '@netvote/core';
import {v4 as uuid} from 'uuid';
import * as async from 'async';

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
    private db: FirestoreService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {

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

  signOut(navigate = false): void {
    this.afAuth.auth.signOut().then(() => {
      if (navigate)
        this.router.navigate(['/']);
    });
  }

  emailSignUp(email: string, password: string, firstName, lastName) {

    let uid: string = null;
    let orgid: string = null;
    let orgreference: any = null;

    // Create the user in firebase
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)

      .then((user) => {

        uid = user.uid;

        // Create the user document in firestore
        const data = {
          uid: user.uid,
          email: user.email,
          displayName: `${firstName} ${lastName}`
        };

        return this.db.set<User>(`user/${user.uid}`, data as User);

      })
      .then((userref) => {

        // Create the org document
        const org = {
          slug: uuid(),
          displayName: `${firstName} ${lastName}`
        };

        return this.db.add<OrgUser>('org', org as Org);

      })
      .then((orgref) => {

        orgid = orgref.id;
        orgreference = orgref;

        // Set the org relationship
        const orguser = {
          uid: uid,
          orgid: orgref.id,
          roles: ['admin']
        };

        return this.db.add<OrgUser>('orguser', orguser as OrgUser);

      })
      .then((orguser) => {

        // Set the user's current org
        return this.db.update<User>(`user/${uid}`, {currentOrg: orgreference});

      })
      .catch(error => console.log(error));
  }

  private unestablishUser() {
    this.currentUser = null;
    this.currentOrg = null;
    this.authState = null;
  }

  private establishUser(fbuser: firebase.User) {

    return new Promise<{user: User, org: Org}>((resolve, reject) => {

      async.waterfall([
        // Get the attached user
        (cb) => {

          this.db.docWithRefs$<User>(`user/${fbuser.uid}`).subscribe((user) => {
            this.currentUser = user;
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

  emailLogin(email: string, password: string): Promise<any> {

    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((fbuser) => {
        return this.establishUser(fbuser);
      });

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
