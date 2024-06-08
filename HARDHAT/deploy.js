const hre = require("hardhat");

async function main() {
  const votingContract = await ethers.getContractFactory("Voting");
  const deployedVotingcontract = await votingContract.deploy();

  console.log(`Contract Address deployed: ${deployedVotingcontract.target}`);
}


/*const deployedVotingcontract = await votingContract.deploy();

  console.log(`Contract Address deployed: ${deployedVotingcontract.target}`);*/

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//deploy the contract

//Contract Address deployed: 0xd91B473D8dA52E4B086f3e054488D11A1870997e

//c2
//0xaf2Ba6003d2933B5f7799e6c4F1144e92fb48Da9

//c3  0xb13161169908f320979EC8630b83C178beeaA4DF

// with stopelection: 0x98a25fb400C0D150E6c45794C6bEda89A9D1eE3E



//0x678a00467cF02BaE3ee6BF06e46b859DE2aF18b9