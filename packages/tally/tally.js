const contract = require("truffle-contract");
const Web3 = require("web3");
const protobuf = require("protobufjs");
const crypto = require('crypto');
const IPFS = require('ipfs-mini');
const abiDecoder = require('abi-decoder');
const ipfs = new IPFS({ host: 'gateway.ipfs.io', port: 443, protocol: 'https' });

Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};


let web3;
let protoPath = "./node_modules/@netvote/elections-solidity/protocol/vote.proto";

let BasicElection = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/BasicElection.json'));
let TieredElection = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/TieredElection.json'));
let TieredBallot = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/TieredBallot.json'));
let TieredPool = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/TieredPool.json'));
let BaseBallot = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/BaseBallot.json'));
let BasePool = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/BasePool.json'));
let BaseElection = contract(require('./node_modules/@netvote/elections-solidity/build/contracts/BaseElection.json'));

const poolAbi = require('./node_modules/@netvote/elections-solidity/build/contracts/BasePool.json').abi
abiDecoder.addABI(poolAbi);

/**
 * Wrapper function that tallies results for a ballot
 * @param {object} params - object containing all required parameters
 * @param {string} params.electionAddress - the address of the ballot to tally
 * @param {string} params.provider - the url of the provider of the remote node (default: localhost:9545)
 * @param {string} params.resultsUpdateCallback - each vote will invoke this callback w/results (for ui)
 * @returns {Promise}
 */
const tallyElection = async (params) => {
    initTally(params);
    let election = TieredElection.at(params.electionAddress);
    let electionType = await election.electionType();
    if(params.protoPath){
        protoPath = params.protoPath
    }
    switch(electionType){
        case "TIERED":
            return tallyTieredElection(params);
        case "BASIC":
            return tallyBasicElection(params);
        default:
            throw Error("invalid election type: "+electionType);
    }
};

const tallyTieredElection = async (params) => {
    initTally(params);
    let Vote = await voteProto();
    let election = TieredElection.at(params.electionAddress);
    let key = await election.privateKey();
    
    let results = {
        election: params.electionAddress,
        ballots: {}
    };

    let poolCount = await election.getPoolCount();
    for(let p = 0; p < poolCount; p++){
        let poolAddress = await election.getPool(p);
        let pool = TieredPool.at(poolAddress);
        let ballotCount = await pool.getBallotCount();
        for(let b = 0; b<ballotCount; b++){
            let ballotAddress = await pool.getBallot(b);
            let ballot = TieredBallot.at(ballotAddress);
            let poolGroups = await getGroupsForPool(ballot, poolAddress);
            let voteCount = await pool.getVoteCount();
            let metadata = await getIpfsBallot(ballot);

            if (!results.ballots[ballotAddress]) {
                results.ballots[ballotAddress] = {
                    totalVotes: 0,
                    decisionMetadata: metadata.decisions,
                    ballotTitle: metadata.title,
                    results: {}
                };
            }

            for(let i=0; i<voteCount; i++){
                try {
                    let encrypted = await pool.getVoteAt(i);
                    let encoded = decrypt(encrypted, key);
                    let buff = Buffer.from(encoded, 'utf8');
                    let vote = Vote.decode(buff);
                    if (validateBallotCount(vote, ballotCount)) {
                        let choices = vote.ballotVotes[0].choices;
                        if (validateChoices(choices, metadata.decisions)) {
                            poolGroups.forEach((group, pgi) => {
                                if (!results.ballots[ballotAddress].results[group]) {
                                    results.ballots[ballotAddress].results[group] = []
                                }
                                results = tallyVote(choices, ballotAddress, group, results, metadata);
                            });
                            params.resultsUpdateCallback({
                                status: "tallying",
                                progress: {
                                    poolIndex: p,
                                    poolTotal: parseInt(poolCount),
                                    poolBallotIndex: b,
                                    poolBallotTotal: parseInt(ballotCount),
                                    poolVoterIndex: i,
                                    poolVoterTotal: parseInt(voteCount)
                                },
                                results: results
                            });
                        } else {
                            log("skipping vote due to invalid choices: "+encoded);
                        }
                    } else {
                        log("skipping vote due to invalid number of ballots: "+encoded);
                    }
                }catch(e){
                    console.error(e);
                    log("skipping vote due to extraction error: "+e.message);
                }
            }
        }
    }

    return results;
};

const extractVoteFromTx = (txId) => {
    return new Promise(async (resolve, reject) => {

        web3.eth.getTransaction(txId,
            (err, res) => {
                let txObj = abiDecoder.decodeMethod(res.input);
                resolve( {
                    pool: res.to,
                    voteId: txObj.params[0].value,
                    vote: txObj.params[1].value,
                    passphrase: txObj.params[2].value
                });
            });
    });
}


const tallyTxVote = async (params) => {

    initTally(params);
    const Vote = await voteProto();
    const txId = params.txId;
    const election = BaseElection.at(params.electionAddress);
    const key = await election.privateKey();

    if(!key){
        throw "Vote is encrypted until Election Close";
    }

    let voteObj = await extractVoteFromTx(txId);

    let results = {
        election: params.electionAddress,
        ballots: {},
        passphrase: voteObj.passphrase
    };

    const pool = BasePool.at(voteObj.pool);

    let encrypted = await pool.votes(voteObj.voteId);
    let encoded = decrypt(encrypted, key);
    let buff = Buffer.from(encoded, 'utf8');
    let vote = Vote.decode(buff);

    let ballotCount = await pool.getBallotCount();

    if (validateBallotCount(vote, parseInt(ballotCount))) {

        for(let i=0; i<ballotCount; i++){

            let choices = vote.ballotVotes[i].choices;
            let ballotAddress = await pool.getBallot(i);

            let ballot = BaseBallot.at(ballotAddress);
            let metadata = await getIpfsBallot(ballot);

            results.ballots[ballotAddress] = {
                totalVotes: 1,
                decisionMetadata: metadata.decisions,
                ballotTitle: metadata.title,
                results:{"ALL":[]}
            };

            if (validateChoices(choices, metadata.decisions)) {
                results = tallyVote(choices, params.electionAddress, "ALL", results, metadata);
            } else {
                throw "Invalid vote structure for ballot: "+ballotAddress;
            }
        }
        return results;
    } else {
        throw "Expected "+ballotCount+" ballots but found "+vote.ballotVotes.length;
    }



};

const tallyBasicElection = async (params) => {
    initTally(params);
    let Vote = await voteProto();
    let election = BasicElection.at(params.electionAddress);
    let key = await election.privateKey();
    let voteCount = await election.getVoteCount();
    let metadata = await getIpfsBallot(election);

    //comply with tiered results structure
    let results = {
        election: params.electionAddress,
        ballots: {}
    };
    results.ballots[params.electionAddress] = {
        totalVotes: 0,
        decisionMetadata: metadata.decisions,
        ballotTitle: metadata.title,
        results:{"ALL":[]}
    };
    log("vote count = "+voteCount);
    for(let i=0; i<voteCount; i++){
        try {
            let encrypted = await election.getVoteAt(i);
            let encoded = decrypt(encrypted, key);
            log("length="+encoded.length);
            log("encoded="+encoded);
            let buff = Buffer.from(encoded, 'utf8');
            let vote = Vote.decode(buff);
            if (validateBallotCount(vote, 1)) {
                let choices = vote.ballotVotes[0].choices;
                if (validateChoices(choices, metadata.decisions)) {
                    results = tallyVote(choices, params.electionAddress, "ALL", results, metadata);
                    params.resultsUpdateCallback({
                        status: "tallying",
                        progress: {
                            poolIndex: 0,
                            poolTotal: 1,
                            poolBallotIndex: 0,
                            poolBallotTotal: 1,
                            poolVoterIndex: i,
                            poolVoterTotal: parseInt(voteCount)
                        },
                        results: results
                    });
                } else {
                    log("skipping vote due to invalid choices: "+encoded);
                }
            } else {
                log("skipping vote due to invalid number of ballots: "+encoded);
            }
        }catch(e){
            console.error(e);
            log("skipping vote due to extraction error: "+e.message);
        }
    }
    return results;
};

// INTERNAL METHODS

const validateBallotCount = (vote, count) => {
    return vote.ballotVotes.length === count;
};

const validateChoices = (choices, decisionsMetadata) => {
    if(choices.length !== decisionsMetadata.length){
        return false;
    }
    choices.forEach((c, idx)=>{
       if(!c.writeIn){
           if(c.selection < 0){
               log("INVALID selection < 0: "+c.selection);
               return false;
           }
           if(c.selection > (decisionsMetadata[idx].ballotItems.length-1)){
               log("INVALID selection > array: "+c.selection);
               return false;
           }
       }
    });
    return true;
};

const log = (msg) => {
    //console.log(msg);
};

const initDecisionResults = (decisionMeta) => {
    let decisionResults = {};
    decisionMeta.ballotItems.forEach((d)=>{
        decisionResults[d.itemTitle] = 0;
    });
    return decisionResults;
};

const tallyVote = (choices, ballot, group, result, metadata) => {
    choices.forEach((choice, idx) => {
        let decisionMeta = metadata.decisions[idx];
        let decisionKey = idx;

        // inititalize
        if(!result.ballots[ballot].results[group][decisionKey]){
            result.ballots[ballot].results[group][decisionKey] = initDecisionResults(decisionMeta);
        }

        let decision = result.ballots[ballot].results[group][decisionKey];
        if(choice.writeIn){
            let writeInVal = choice.writeIn.toUpperCase().trim();
            if(!decision["WRITEIN-"+writeInVal]){
                decision["WRITEIN-"+writeInVal] = 0;
            }
            decision["WRITEIN-"+writeInVal]++;
        }else{
            let selectionIndex = parseInt(choice.selection);
            let selectionTitle = decisionMeta["ballotItems"][selectionIndex]["itemTitle"];
            decision[selectionTitle]++;
        }
        result.ballots[ballot].results[group][idx] = decision;
    });
    result.ballots[ballot].totalVotes++;
    return result;
};

const initTally = (params) => {
    if (!params.provider) {
        throw new Error("param.provider is required")
    }
    if (!params.electionAddress) {
        throw new Error("param.electionAddress is required")
    }
    if (!params.resultsUpdateCallback){
        params.resultsUpdateCallback = (obj) => {
            log(JSON.stringify(obj));
        }
    }
    let provider = new Web3.providers.HttpProvider(params.provider);
    BasicElection.setProvider(provider);
    TieredPool.setProvider(provider);
    TieredBallot.setProvider(provider);
    TieredElection.setProvider(provider);
    BasePool.setProvider(provider);
    BaseBallot.setProvider(provider);
    BaseElection.setProvider(provider);
    web3 = new Web3(provider);
};


const voteProto = async () => {
    let root = await protobuf.load(protoPath);
    return root.lookupType("netvote.Vote");
};

const getIpfsBallot = (ballot) => {
    return new Promise(async (resolve, reject) => {
        let location = await ballot.metadataLocation();
        ipfs.catJSON(location, (err, metadata) => {
       	log(JSON.stringify(metadata));
	if(err){
                console.error(err);
                reject(err);
            }
            let decisions = [];
            metadata.ballotGroups.forEach((bg)=>{
                decisions.pushArray(bg.ballotSections);
            });
            resolve({
                title: metadata.ballotTitle,
                decisions: decisions
            });
        });
    });
};

const getGroupsForPool = async(ballot, poolAddr) => {
    let pgCount = await ballot.getPoolGroupCount(poolAddr);
    let groups = [];
    for(let i=0; i<pgCount; i++){
        let g = await ballot.getPoolGroupAt(poolAddr, i);
        groups.push(web3.toAscii(g).replace(/[\u0000]/g, '').trim());
    }
    return groups;
};

function decrypt(v, password){
    let decipher = crypto.createDecipher("aes-256-cbc", new Buffer(password));
    let dec = decipher.update(v, "base64","utf8");
    dec += decipher.final("utf8");
    return dec;
}

module.exports = {
    tallyElection,
    tallyTxVote
};
