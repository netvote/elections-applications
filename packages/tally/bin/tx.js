#!/usr/bin/env node

let program = require('commander');
let tally = require('../tally');

let election="";

program
    .version('0.0.1')
    .usage('[options] <electionAddress>')
    .arguments('<electionAddress>').action(function (electionAddress) {
    election = electionAddress;
})
    .option("-p, --provider [provider]", "Use specified endpoint")
    .option("-t, --tx [tx]", "Transaction ID")
    .parse(process.argv);

if(!election) {
    console.log("First argument must contain valid address of election (e.g., 0xabc...)");
    program.help();
    process.exit(1);
}

if(!program.tx) {
    console.log("Transaction ID (--tx, -t) is required.  Example: 0xd0f84a0942f5aec58fff4134e15f7c01893bc9f388d0c53b17e5d215dcb8ba55");
    program.help();
    process.exit(1);
}

if(!program.provider) {
    console.log("Provider (--provider, -p) is required.  Example: https://ropsten.infura.io");
    program.help();
    process.exit(1);
}

tally.tallyTxVote({
    electionAddress: election,
    provider: program.provider,
    txId: program.tx
}).then((res) => {
    console.log(JSON.stringify(res, null, "\t"));
}).catch((err) => {
    console.error(err);
});