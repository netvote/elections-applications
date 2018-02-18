export class Ballot {
    constructor(
        public address: string,
        public title: string,
        public ipfs: string,
        public type: string,
        public waiting?: boolean,
        public status?: string,        
        public description?: string,
        public token?: string,
        public votes?: string,
        public selections?: any,
        public result?: string,
        public collection?: string,
        public tx?: string,
        public url?: string,
        public voteId?: string,
        public meta?: any) {
        this.status = "initial";
    }
    public timestamp: Date

}