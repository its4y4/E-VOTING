// Select DOM elements
const connectWalletmsg = document.querySelector('#message');
const connectWallet = document.querySelector('#walletconnect');
const votingSation = document.querySelector('#content');
const timer = document.querySelector('#time');
const timerMsg = document.querySelector('#timerMssg');
const mainBoard = document.querySelector('#tableCandidat');
const voteForm = document.querySelector('#voteform');
const vote = document.querySelector('#vote');
const voteButton = document.querySelector('#confirm');
const showRslt = document.querySelector('#showResultcont');
const showResultButton = document.querySelector('#showResult');
const result = document.querySelector('#result');
const admin = document.querySelector('#owner');
const candidates = document.querySelector('#candidates');
const electionDurt = document.querySelector('#electionDuration');
const startElectionButton = document.querySelector('#start');
const candidate = document.querySelector('#candidate');
const addCandidateButton = document.querySelector('#add');
const voteMsg = document.querySelector('#voteMsg');
const resetVoterStatusButton = document.querySelector('#resetVoterStatus');
const stopElectionButton = document.querySelector('#stopElection');

// Ethers.js setup
const contractAddress = "0x678a00467cF02BaE3ee6BF06e46b859DE2aF18b9";
const contractABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"ElectionStopped","type":"event"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"numberOfVotes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"checkElectionPeriod","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"electionStart","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"electionTimer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVotes","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"numberOfVotes","type":"uint256"}],"internalType":"struct Voting.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"listOfVoters","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"resetAllVoterStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_candidates","type":"string[]"},{"internalType":"uint256","name":"_votingDuration","type":"uint256"}],"name":"startElection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopElection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"voterStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

let provider;
let signer;
let contract;
let ownerAddress = "0xABa483fDa65F128D3e958A0a96BD5A9d689B9E51";

async function Connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      const userAddress = await signer.getAddress();
      connectWalletmsg.textContent = `Wallet connected: ${userAddress}`;
      alert("Wallet connected successfully!");

      if (userAddress.toLowerCase() === ownerAddress.toLowerCase()) {
        admin.style.display = 'block';
        resetVoterStatusButton.style.display = 'block';
        stopElectionButton.style.display = 'block';
      } else {
        admin.style.display = 'none';
        resetVoterStatusButton.style.display = 'none';
        stopElectionButton.style.display = 'none';
      }

      votingSation.style.display = 'block';
      mainBoard.style.display = 'block';
      voteForm.style.display = 'block';
      showRslt.style.display = 'block';
      result.style.display = 'block';

      updateCandidatesTable();
      updateResultsTable();
      updateTimer();

      contract.on("ElectionStopped", () => {
        alert("Election has been stopped!");
        timer.textContent = "0";
      });

    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  } else {
    connectWalletmsg.textContent = "MetaMask is not installed. Please install MetaMask and try again.";
  }
}

connectWallet.addEventListener('click', Connect);

async function addCandidate() {
  const candidateName = candidate.value.trim(); // Trim whitespace

  if (candidateName.length === 0) {
      alert("Please enter a valid candidate name.");
      return;
  }

  try {
      console.log("Adding candidate:", candidateName);
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      console.log("Candidate added:", candidateName);
      alert("Candidate added successfully!");
      updateCandidatesTable();
  } catch (error) {
      console.error("Error adding candidate:", error);
      alert("Error adding candidate. Check the console for more details.");
  }
}



async function startElection() {
  const duration = parseInt(electionDurt.value);
  const candidateNames = candidates.value.split(",").map(name => name.trim());

  if (isNaN(duration) || duration <= 0) {
    alert("Please enter a valid duration.");
    return;
  }

  if (candidateNames.length === 0 || candidateNames.some(name => name.length === 0)) {
    alert("Please enter valid candidate names.");
    return;
  }

  console.log("Parsed duration:", duration);
  console.log("Parsed candidate names:", candidateNames);

  try {
    console.log("Attempting to start election with candidates:", candidateNames, "and duration:", duration);
    const tx = await contract.startElection(candidateNames, duration, { gasLimit: 3000000 });
    await tx.wait();
    console.log("Election started for duration:", duration);
    alert("Election started successfully!");
    updateTimer();
  } catch (error) {
    console.error("Error starting election:", error);
    alert("Error starting election. Check the console for more details.");
  }
}

startElectionButton.addEventListener('click', startElection);

async function confirmVote() {
  const candidateId = vote.value;
  if (candidateId) {
    try {
      console.log("Voting for candidate ID:", candidateId);
      const tx = await contract.vote(candidateId);
      await tx.wait();
      console.log("Vote confirmed for candidate ID:", candidateId);
      alert("Vote confirmed successfully!");
      updateResultsTable();
    } catch (error) {
      if (error.message.includes("You have already voted.")) {
        alert("You have already voted.");
      } else {
        console.error("Error confirming vote:", error);
      }
    }
  }
}

voteButton.addEventListener('click', confirmVote);

async function showResults() {
  try {
    console.log("Fetching election results");
    const results = await contract.getVotes();
    result.innerHTML = '<table><thead><tr><th>ID</th><th>Name</th><th>Votes</th></tr></thead><tbody>' +
      results.map(c => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.numberOfVotes}</td></tr>`).join('') +
      '</tbody></table>';
  } catch (error) {
    console.error("Error fetching election results:", error);
  }
}

showResultButton.addEventListener('click', showResults);

async function resetVoterStatus() {
  try {
    console.log("Resetting voter status");
    const tx = await contract.resetAllVoterStatus();
    await tx.wait();
    console.log("Voter status reset successfully");
    alert("Voter status reset successfully!");
  } catch (error) {
    console.error("Error resetting voter status:", error);
  }
}

resetVoterStatusButton.addEventListener('click', resetVoterStatus);

async function stopElection() {
  try {
    console.log("Stopping election");
    const tx = await contract.stopElection();
    await tx.wait();
    console.log("Election stopped successfully");
    alert("Election stopped successfully!");
    timer.textContent = "0";
  } catch (error) {
    console.error("Error stopping election:", error);
  }
}

stopElectionButton.addEventListener('click', stopElection);

async function resetElectionStatus() {
  try {
    console.log("Resetting election status");
    const tx = await contract.stopElection();
    await tx.wait();
    console.log("Election status reset successfully");
    alert("Election status reset successfully!");
  } catch (error) {
    console.error("Error resetting election status:", error);
  }
}


async function updateCandidatesTable() {
  try {
    const candidates = await contract.getVotes();
    const table = document.querySelector('#candidateTable');
    table.innerHTML = '';
    candidates.forEach(candidate => {
      const row = table.insertRow();
      row.insertCell(0).textContent = candidate.id;
      row.insertCell(1).textContent = candidate.name;
      row.insertCell(2).textContent = candidate.numberOfVotes;
    });
  } catch (error) {
    console.error("Error updating candidates table:", error);
  }
}

async function updateResultsTable() {
  try {
    const candidates = await contract.getVotes();
    const table = document.querySelector('#resultsTable');
    table.innerHTML = '';
    candidates.forEach(candidate => {
      const row = table.insertRow();
      row.insertCell(0).textContent = candidate.id;
      row.insertCell(1).textContent = candidate.name;
      row.insertCell(2).textContent = candidate.numberOfVotes;
    });
  } catch (error) {
    console.error("Error updating results table:", error);
  }
}

async function updateTimer() {
  try {
    const timeRemaining = await contract.electionTimer();
    timer.textContent = timeRemaining.toString();
    if (timeRemaining > 0) {
      setTimeout(updateTimer, 1000);
    }
  } catch (error) {
    console.error("Error updating timer:", error);
  }
}
