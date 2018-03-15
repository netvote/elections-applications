import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {SecureStorage, SecureStorageObject} from "@ionic-native/secure-storage";
import {TouchID} from '@ionic-native/touch-id';
import {Observable} from 'rxjs/Observable';

import * as pwHashSalt from 'password-hash-and-salt';

export declare var lightwallet: any;

@Injectable()
export class AuthProvider {

  readonly STORAGE_KEY = "auth_1";
  readonly LOGIN_STATE_KEY = "state_1";
  readonly WALLLET_XREF_KEY = "walletxref_1";
  readonly HASH_KEY = "hash_1";
  readonly KEYSTORE_KEY = "keystore_1";
  readonly BIOMETRIC_KEY = "biometric_1";

  readonly ENABLE_KEYSTORE = false;

  private theObservable: Observable<AuthStateChange>;
  private lastAuthState: AuthState = null;

  private secureStorageObject: SecureStorageObject;
  private secureStorageProxy: HorriblyInsecureSecureStorageProxy;

  constructor(public http: Http,
    private secureStorage: SecureStorage,
    private biometric: TouchID) {
  }

  public getAuthStateObservable(): Observable<AuthStateChange> {
    return this.theObservable || Observable.create((observer) => {
      setInterval(async () => {
        const state = await this.authState();
        if (state !== this.lastAuthState) {
          const change = new AuthStateChange(this.lastAuthState, state);
          this.lastAuthState = state;
          observer.next(change);
        }
      }, 1000);
    });
  }

  public authState(): Promise<AuthState> {
    return new Promise(async (resolve, reject) => {
      try {
        const storage = await this.getSecureStorage(this.STORAGE_KEY);
        const state = await storage.get(this.LOGIN_STATE_KEY);
        if (!state)
          return resolve(AuthState.NotSetUp);
        switch (AuthState[state]) {
          case "LoggedIn":
            return resolve(AuthState.LoggedIn);
          case "LoggedOut":
            return resolve(AuthState.LoggedOut);
          case "Locked":
            return resolve(AuthState.Locked);
          case "Disabled":
            return resolve(AuthState.Disabled);
          case "Verifying":
            return resolve(AuthState.Verifying);
          default:
            return resolve(AuthState.NotSetUp);
        }
      } catch (err) {
        return resolve(AuthState.NotSetUp);
      }
    });
  }

  public async getWalletAddress(passcode: string, key: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const keystore = await this.getKeystore();
      let addresses = keystore.getAddresses();
      const xref = await this.getWalletCrossref();
      let address = xref[key];
      if (!address || addresses.indexOf(address) === -1) {
        keystore.keyFromPassword(passcode, async (err, derived) => {
          if (err)
            return reject(err);
          keystore.generateNewAddress(derived, 1);
          addresses = keystore.getAddresses();
          address = addresses[addresses.length - 1];
          xref[key] = address;
          await this.saveWalletCrossref(xref);
          await this.saveKeystore(keystore);
          return resolve(address);
        });
      } else {
        return resolve(address);
      }
    });
  }

  private async saveWalletCrossref(xref: any): Promise<any> {
    const storage = await this.getSecureStorage(this.STORAGE_KEY);
    await storage.set(this.WALLLET_XREF_KEY, JSON.stringify(xref));
    return xref;
  }

  private async getWalletCrossref(): Promise<any> {
    const storage = await this.getSecureStorage(this.STORAGE_KEY);
    let xrefdat;
    let xref = {};
    try {
      xrefdat = await storage.get(this.WALLLET_XREF_KEY);
      if (xrefdat)
        xref = JSON.parse(xrefdat);
    } catch (error) {
      await storage.set(this.WALLLET_XREF_KEY, JSON.stringify(xref));
    }
    return xref;
  }

  public async register(passcode: string, enableBiometric: boolean = false): Promise<AuthResponse> {
    return new Promise<AuthResponse>((resolve, reject) => {
      pwHashSalt(passcode).hash(async (err, hash) => {
        if (err) return reject(err);
        try {          
          const storage = await this.getSecureStorage(this.STORAGE_KEY);
          await storage.clear();
          await storage.set(this.HASH_KEY, hash);
          if (this.ENABLE_KEYSTORE) {
            const keystore = await this.createKeystore(passcode);
            const serialized = keystore.serialize();
            await storage.set(this.KEYSTORE_KEY, serialized);
          }
          if (enableBiometric) {
            const check = await this.checkBiometric();
            if (check)
              await storage.set(this.BIOMETRIC_KEY, passcode);
          }
          else
            await storage.set(this.BIOMETRIC_KEY, "");
          await storage.set(this.LOGIN_STATE_KEY, AuthState.LoggedIn.toString());
          return resolve(new AuthResponse(true));
        } catch (err) {
          return reject(err);
        }
      });
    });
  }

  public async login(passcode: string, enableBiometric: boolean = null, biometricMessage: string = null): Promise<AuthResponse> {
    try {
      const check = await this.checkLogin(passcode);
      if (!check.success)
        return check;
      const storage = await this.getSecureStorage(this.STORAGE_KEY);
      if (enableBiometric !== null) {
        if (enableBiometric) {
          const check = await this.checkBiometric(biometricMessage);
          if (check)
            await storage.set(this.BIOMETRIC_KEY, passcode);
        } else {
          await storage.set(this.BIOMETRIC_KEY, "");
        }
      }
      await storage.set(this.LOGIN_STATE_KEY, AuthState.LoggedIn.toString());
      return new AuthResponse(true);
    } catch (error) {
      return new AuthResponse(false);
    }
  }

  public checkLogin(passcode: string): Promise<AuthResponse> {
    return new Promise<AuthResponse>(async (resolve, reject) => {
      try {
        const storage = await this.getSecureStorage(this.STORAGE_KEY);
        storage.get(this.HASH_KEY).then(async(hash) => {
          pwHashSalt(passcode).verifyAgainst(hash, (err, verified) => {
            if (err) {
              return resolve(new AuthResponse(false, err));
            }
            if (!verified) return resolve(new AuthResponse(false));
            return resolve(new AuthResponse(true));
          });
        }, async (error) => {
          await storage.clear();          
          return resolve(new AuthResponse(false, undefined, undefined, true));
        });

        // const hash = await storage.get(this.HASH_KEY);
        // console.log("NV: Auth hash: ", hash);
        // pwHashSalt(passcode).verifyAgainst(hash, async (err, verified) => {
        //   if (err) {
        //     console.log("NV: Err: ", JSON.stringify(err));
        //     return resolve(new AuthResponse(false, err));
        //   }
        //   if (!verified) return resolve(new AuthResponse(false));
        //   return resolve(new AuthResponse(true));
        // });
      } catch (error) {
        return resolve(new AuthResponse(false));
      }
    });
  }

  public async lock(): Promise<boolean> {
    const storage = await this.getSecureStorage(this.STORAGE_KEY);
    const state = await storage.get(this.LOGIN_STATE_KEY);
    if (!state || AuthState[state] !== "LoggedIn")
      return false;
    await storage.set(this.LOGIN_STATE_KEY, AuthState.Locked.toString());
    return true;
  }

  public async logout(removeBiometric: boolean = true): Promise<boolean> {
    const storage = await this.getSecureStorage(this.STORAGE_KEY);
    await storage.set(this.LOGIN_STATE_KEY, AuthState.LoggedOut.toString());
    if (removeBiometric)
      await storage.set(this.BIOMETRIC_KEY, "");
    return true;
  }

  public async checkBiometric(message: string = null): Promise<boolean> {
    try {
      await this.biometric.verifyFingerprint(message || 'Scan your fingerprint to log in');
      return true
    } catch (err) {
      return false
    }
  }

  public async loginByBiometric(message?: string, opts?: any): Promise<AuthResponse> {
    let defaults: any = {returnPasscode: false};
    try {
      await this.biometric.verifyFingerprint(message || 'Scan your fingerprint to log in');
      const storage = await this.getSecureStorage(this.STORAGE_KEY);
      const pinget = await storage.get(this.BIOMETRIC_KEY);
      if (pinget) {
        const res = await this.login(pinget);
        if (!res.success)
          return res;
        Object.assign(defaults, opts);
        if (defaults.returnPasscode)
          res.passcode = pinget;
        return res;
      }
      return new AuthResponse(false);
    } catch (err) {
      return new AuthResponse(false);
    }
  }

  public async getBiometricType(): Promise<string> {
    try {
      const type = await this.biometric.isAvailable();
      return type;
    } catch (error) {
      return null;
    }
  }

  public async userHasBiometric(): Promise<boolean> {
    try {
      await this.biometric.isAvailable();
      const storage = await this.getSecureStorage(this.STORAGE_KEY);
      const biometric = await storage.get(this.BIOMETRIC_KEY);
      return !!biometric;
    } catch (error) {
      return false;
    }
  }

  public async deviceHasBiometric(): Promise<boolean> {
    try {
      await this.biometric.isAvailable();
      return true;
    } catch (error) {
      return false;
    }
  }

  private createKeystore(passcode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      lightwallet.keystore.createVault({password: passcode}, (err, ks) => {
        if (err) {
          return reject(err);
        }
        return resolve(ks);
      });
    });
  }

  private async saveKeystore(keystore: any): Promise<any> {
    const storage = await this.getSecureStorage(this.STORAGE_KEY);
    const serialized = keystore.serialize();
    await storage.set(this.KEYSTORE_KEY, serialized);
    return keystore;
  }

  private async getKeystore(): Promise<any> {
    const storage = await this.getSecureStorage(this.STORAGE_KEY);
    const serialized = await storage.get(this.KEYSTORE_KEY);
    const keystore = lightwallet.keystore.deserialize(serialized);
    return keystore;
  }

  private async getSecureStorage(name: string) {
    if (!!window["cordova"]) {
      if (!this.secureStorageObject) {
        this.secureStorageObject = await this.secureStorage.create(name);
      }
      return this.secureStorageObject;
    } else {
      if (!this.secureStorageProxy) {
        this.secureStorageProxy = new HorriblyInsecureSecureStorageProxy(name);
      }
      return this.secureStorageProxy;
    }
  }

  public async reset(passcode: string) {
    const check = await this.checkLogin(passcode);
    if (check) {
        const ss = await this.getSecureStorage(this.STORAGE_KEY);
        return ss.clear();
    } else {
      return false;
    }
  }
}

export enum AuthState {
  NotSetUp,
  LoggedIn,
  LoggedOut,
  Locked,
  Disabled,
  Verifying
}
export class AuthStateChange {
  constructor(public prior: AuthState, public current: AuthState) {}
}

export class AuthResponse {
  constructor(public success: boolean = false, public message?: string, public passcode?: string, public was_reset?: boolean) {}
}

class HorriblyInsecureSecureStorageProxy {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  public async get(key: string) {
    return localStorage.getItem(`${this.name}.${key}`);
  }
  public async set(key: string, value: string) {
    return localStorage.setItem(`${this.name}.${key}`, value);
  }

  public async clear() {
    // TODO: Enumerate or store as {} so no hardcoded keys
    await localStorage.removeItem("auth.hash");
    await localStorage.removeItem("auth.state");
    await localStorage.removeItem("auth.keystore");
    await localStorage.removeItem("auth.biometric");
    return true;
  }
}
