import Eth from 'ethjs';
import * as IPFS from 'ipfs-mini';

export class BlockchainConnection {
    eth: any;
    ipfs: any;

    constructor() {
        this.eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io'));
    }

    getContract(abi: any, address: string = ''): any {
        const c = this.eth.contract(abi);
        return !address ? c : c.at(address);
    }

    getIPFSConnection(): any {
        if (!this.ipfs) {
            this.ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
            this.ipfs.p = {};
            // Promisify a couple of the useful functions
            this.ipfs.p.addJSON = (json) => {
                return new Promise((resolve, reject) => {
                    this.ipfs.addJSON(json, (err, res) => {if (err) return reject(err); return resolve(res);});
                });
            };
            this.ipfs.p.catJSON = (address) => {
                return new Promise((resolve, reject) => {
                    this.ipfs.catJSON(address, (err, res) => {if (err) return reject(err); return resolve(res);});
                });
            };
            this.ipfs.p.add = (json) => {
                return new Promise((resolve, reject) => {
                    this.ipfs.add(json, (err, res) => {if (err) return reject(err); return resolve(res);});
                });
            };
            this.ipfs.p.cat = (address) => {
                return new Promise((resolve, reject) => {
                    this.ipfs.cat(address, (err, res) => {if (err) return reject(err); return resolve(res);});
                });
            };
            this.ipfs.p.stat = (address) => {
                return new Promise((resolve, reject) => {
                    this.ipfs.stat(address, (err, res) => {if (err) return reject(err); return resolve(res);});
                });
            };
        }
        return this.ipfs;
    }

    getTransaction(tx: string): any {
        return this.eth.getTransactionByHash(tx);
    }
}