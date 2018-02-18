import * as electionJSON from '@netvote/elections-solidity/build/contracts/BasicElection.json';

export class BallotFactory {

    static getMeta(type: string = ''): any {
        switch (type) {
            case 'public':
            case 'basic':
            case '':
                return electionJSON;
            default:
                return null;
        }
    }

}
