Netvote Tally Library
======================
[![Build Status](https://travis-ci.org/netvote/elections-tally.svg?branch=master)](https://travis-ci.org/netvote/elections-tally)

<img src="https://s3.amazonaws.com/netvote-docs/nv.png" alt="Logo"  height="25%" width="25%"/>

Library and CLI for tallying elections

Example Usage:
```javascript
const tally = require('@netvote/elections-tally');

tally.tallyElection({
    electionAddress: '0xabcd9ebf41456077e2074d66d68e2aeb1286be4b',
    provider: 'https://ropsten.infura.io',
    resultsUpdateCallback: (resultsStatusObj) => {
        
        // Update UI progress indicators (graphs/etc)
        
    }
}).then((finalResults) => {
    
    // Tallying complete
    
}).catch((err) => {
    console.error(err);
});

```

Example Results Status Object
```javascript
// pool 0 of 15
// voter 3 of 48748 in pool
// ballot 2 of 3
resultsStatusObj = {
    "status": "tallying",
    "progress": {
        "poolIndex": 0,           //current pool index
        "poolTotal": 15,          //total pools
        "poolBallotIndex": 2,     //current ballot for this pool
        "poolBallotTotal": 3,     //total ballots for pool
        "poolVoterIndex": 3,      //index of voter for this pool
        "poolVoterTotal": 48748   //total voters for this pool
    },
    "results": {
      // current results object
    }
}
```

Example Results
```javascript
finalResults = {
    "election": "0xabcdea541751984aa3e5fd9a1ba3a12e4ba04a23",
    "ballots": {
        "0xabcdea541751984aa3e5fd9a1ba3a12e4ba04a23": {
            "ballotTitle": "2020 NYC Election",
            "totalVotes": 3236,
            "decisionMetadata": [
                {
                    "sectionTitle": "Mayor",
                    "sectionTitleNote": "",
                    "ballotItems": [
                        {
                            "itemTitle": "John Doe",
                            "itemDescription": "..."
                        },
                        {
                            "itemTitle": "Sally Thomas",
                            "itemDescription": "..."
                        }
                    ]
                }
            ],
            "results": {
                "ALL": [
                    {
                        "John Doe": 1001,
                        "Sally Thomas": 2231,
                        "writeIn": {
                            "SARAH WILLIAMS": 4
                        }
                    }
                ]
            }
        }
    }
}
```

Contributing
-------------------

### Contribution Process
1. Fork repo
2. Make desired changes
3. Submit PR (Reference Issue #)
4. Reviewer will review
5. Reviewer Squash + Merges PR

License
-------
All code is released under GPL v3.
