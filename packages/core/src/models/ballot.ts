export interface Ballot {
  id: string;
  orgid: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  json: any;
  json_model: any;
  ipfs: string;
  address: string;
  tx: string;
  type: string;
  network: string;
  pins: string[];
  history: string[];
  featuredImage: string;
  createTxId: string;
  createCollection: string;
  ethTxid: string;
  electionAddress: string;
  isNew: boolean;
  resultsAvailable: boolean;
}

export interface Transaction {
  id: string;
}

export interface Tally {
  address: string;
  completeTime: number;
  results: string;
  status: string;
  timestamp: number;
}
