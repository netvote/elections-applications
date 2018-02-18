rm -rf elections-solidity
git clone https://github.com/netvote/elections-solidity.git
mkdir elections-solidity/test/tally
cp test/*.js elections-solidity/test/tally
cd elections-solidity
npm install