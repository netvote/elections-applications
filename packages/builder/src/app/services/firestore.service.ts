import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase/app';

// Define some predicates that accept a string or a ref
type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable()
export class FirestoreService {

  constructor(public afs: AngularFirestore) {}

  // Get reference helpers

  exists<T>(ref: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.afs.doc<T>(ref).ref.get().then((snap)=>{
        if(snap.exists)
          return resolve(true);
        return resolve(false);
      })  
    });
  }

  /*
  Ex usage:
  const ref: AngularFirestoreDocument<User> = this.db.document("user/1234");
  */
  document<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /*
  Ex usage:
  const ref: AngularFirestoreCollection<User> = this.db.collection("user");
  */
  collection<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  // Get document helpers

  /*
  Ex usage:
  const user: Observable<User> = this.db.document$("user/1234");
  */
  document$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.document(ref).snapshotChanges().map(doc => {
      const id = doc.payload.id;
      const data = doc.payload.data();
      if(!data)
        return null;
      data['id'] = id;
      return data as T;
    });
  }

  /*
  Ex usage:
  const users: Observable<User[]> = this.db.collection$("user");
  */
  collection$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.collection(ref, queryFn).snapshotChanges().map(docs => {
      return docs.map(a => a.payload.doc.data()) as T[];
    });
  }


  // Get a collection with ids

  /*
  Ex usage:
  const users: Observable<User[]> = this.db.collectionWithIds$("user");
  */
  collectionWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.collection(ref, queryFn).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        data['id'] = id;
        return data as T;
      });
    });
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  // Set with automatic timestamps; return the predicate containing afs doc
  set<T>(ref: DocPredicate<T>, data: any): Promise<DocPredicate<T>> {
    const timestamp = this.timestamp;
    ref = this.document(ref);
    return ref.set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    }).then(() => {
      return ref;
    });
  }

  // Update with automatic timestamp; return the predicate containing afs doc
  update<T>(ref: DocPredicate<T>, data: any): Promise<DocPredicate<T>> {    
    const delta = {
      ...data,
      updatedAt: this.timestamp
    };
    ref = this.document(ref);
    return ref.update(delta).then(() => {
      return ref;
    });
  }

  // Add with timestamps
  add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
    const timestamp = this.timestamp;
    return this.collection(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  // Basic delete
  delete<T>(ref: DocPredicate<T>): Promise<void> {
    return this.document(ref).delete();
  }

  // Geo helper
  geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  // Upsert helper
  upsert<T>(ref: DocPredicate<T>, data: any): Promise<DocPredicate<T>> {
    const doc = this.document(ref).snapshotChanges().take(1).toPromise();
    return doc.then(snap => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    });
  }

  // Connect two docs by reference
  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.document(host).update({[key]: this.document(doc).ref});
  }

  // Get a document and its references
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.document$(ref).map(doc => {
      for (const k of Object.keys(doc)) {
        if (doc[k] instanceof firebase.firestore.DocumentReference) {
          doc[k] = this.document$(doc[k].path);
        }
      }
      return doc;
    });
  }

  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();
    this.document(ref).snapshotChanges()
      .take(1)
      .do(d => {
        const tock = new Date().getTime() - tick;
        // console.log(`Loaded Document in ${tock}ms`, d);
      })
      .subscribe();
  }

  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    this.collection(ref).snapshotChanges()
      .take(1)
      .do(c => {
        const tock = new Date().getTime() - tick;
        // console.log(`Loaded Collection in ${tock}ms`, c);
      })
      .subscribe();
  }

}
