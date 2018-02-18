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
    .parse(process.argv);

if(!election) {
    console.log("First argument must contain valid address of election (e.g., 0xabc...)");
    program.help();
    process.exit(1);
}

if(!program.provider) {
    console.log("Provider (--provider, -p) is required.  Example: http://localhost:9545/");
    program.help();
    process.exit(1);
}

tally.tallyElection({
    electionAddress: election,
    provider: program.provider,
    resultsUpdateCallback: (res) => {}
}).then((res) => {
    console.log(JSON.stringify(res, null, "\t"));
}).catch((err) => {
    console.error(err);
});