//NOTE: this is a truffle contract test that is feathered into elections-solidity (for end-to-end test)
//pre-test.sh must run first
//this will run within elections-solidity/test/tally/*

const tally = require("../../../tally.js");

const assertResult = (actual, expected) => {
    let actualStr = JSON.stringify(actual);
    let expectedStr = JSON.stringify(expected);
    assert.equal(actualStr, expectedStr)
};

contract('Basic Tally', function (accounts) {
    const election = require("../end-to-end/jslib/basic-election.js");

    let config;

    before(async ()=>{
        let vote1Json = {
            encryptionSeed: 12345,
            ballotVotes: [
                {
                    choices: [
                        {
                            selection: 2
                        },
                        {
                            selection: 1
                        },
                        {
                            selection: 0
                        }
                    ]
                }
            ]
        };
        let vote2Json = {
            encryptionSeed: 54321,
            ballotVotes: [
                {
                    choices: [
                        {
                            selection: 1
                        },
                        {
                            selection: 1
                        },
                        {
                            writeIn: "John Doe"
                        }
                    ]
                }
            ]
        };

        let vote1 = await election.toEncryptedVote(vote1Json);
        let vote2 = await election.toEncryptedVote(vote2Json);

        config = await election.doEndToEndElectionAutoActivate({
            account: {
                allowance: 3,
                owner: accounts[0]
            },
            netvote: accounts[1],
            admin: accounts[2],
            allowUpdates: false,
            autoActivate: true,
            skipGasMeasurment:  true,
            gateway: accounts[3],
            metadata: "Qmc9oXZnUtcHoa7GxE7Ujwq4zG9SqSqKk5w9Qjqbi1cEWB",
            voters: {
                voter1: {
                    voteId: "vote-id-1",
                    vote: vote1
                },
                voter2: {
                    voteId: "vote-id-2",
                    vote: vote2
                }
            }
        });
    });

    it("should tally two votes", async function () {
        let res = await tally.tallyElection({
            electionAddress: config.contract.address,
            provider: "http://localhost:8545",
            protoPath: "protocol/vote.proto",
            resultsUpdateCallback: (res) => {}
        });

        let ballotResults = res.ballots[config.contract.address];
        assert.equal(ballotResults.totalVotes, 2);
        assertResult(ballotResults.results["ALL"], [
            {
                "John Smith": 0,
                "Sally Gutierrez": 1,
                "Tyrone Williams": 1,
                "writeIn": {}
            },
            {
                "Yes": 0,
                "No": 2,
                "writeIn": {}
            },
            {
                "Doug Hall": 1,
                "Emily Washington": 0,
                "writeIn": {
                    "JOHN DOE": 1
                }
            }
        ])
    })

});