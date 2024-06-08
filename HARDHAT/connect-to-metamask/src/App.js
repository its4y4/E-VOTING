import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = "0xd91B473D8dA52E4B086f3e054488D11A1870997e";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "numberOfVotes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkElectionPeriod",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionStart",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionTimer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVotes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "numberOfVotes",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "listOfVoters",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetAllVoterStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidates",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_votingDuration",
        "type": "uint256"
      }
    ],
    "name": "startElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "voterStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingStart",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


async function requestAccount() {
  console.log('Requesting sccount...');

  //metamask exist
  if(window.ethereum) {
    console.log('detected');

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.log('Error connecting!');
    }
  } else {
    console.log('metamask not detected');
  }
}

async function connectWallet() {
  if(typeof window.ethereum !== 'undefined') {
    await requestAccount();
    const alchemyApiKey = "rKL1zYfpGFlW_hCYB8clvMQ6DwAxg8bl";
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`);
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    
  }
}

/*const alchemyApiKey = "rKL1zYfpGFlW_hCYB8clvMQ6DwAxg8bl";
const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`);
const web3Provider = new ethers.providers.Web3Provider(provider);*/

function App() {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [voteValue, setVoteValue] = useState('');
  const [electionDuration, setElectionDuration] = useState('');
  const [candidate, setCandidate] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [owner, setOwner] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
      initializeContract(contractInstance);
    }
  }, [signer]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (contract) {
        const time = await contract.electionTimer();
        setTimeLeft(time);
        if (time > 0) {
          fetchCandidates();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [contract]);

  const initializeContract = async (contractInstance) => {
    const ownerAddress = await contractInstance.owner();
    setOwner(ownerAddress);
    if (ownerAddress === signer._address) {
      setIsAdmin(true);
      const time = await contractInstance.electionTimer();
      if (time === 0) {
        await contractInstance.checkElectionPeriod();
      }
    }
  };

  const fetchCandidates = async () => {
    const candidates = await contract.getVotes();
    setCandidates(candidates.map((candidate, index) => ({
      id: parseInt(candidate.id),
      name: candidate.name,
      numberOfVotes: parseInt(candidate.numberOfVotes),
    })));
  };

  const fetchResults = async () => {
    const results = await contract.getVotes();
    setResults(results.map((result) => ({
      id: parseInt(result.id),
      name: result.name,
      numberOfVotes: parseInt(result.numberOfVotes),
    })));
  };

  const connectWallet = async () => {
    await provider.send("eth_requestAccounts", []);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner(accounts[0]);
    setSigner(signer);
    setAccount(signer._address);
  };

  const handleVote = async () => {
    await contract.vote(voteValue);
    setVoteValue('');
  };

  const startElection = async () => {
    if (!candidate || !electionDuration) {
      alert('Please provide candidates and election duration.');
      return;
    }
    const candidatesArray = candidate.split(',');
    const duration = parseInt(electionDuration, 10);
    await contract.startElection(candidatesArray, duration);
    fetchCandidates();
  };

  const addCandidate = async () => {
    if (!candidate) {
      alert('Please provide the candidate name first.');
      return;
    }
    await contract.addCandidate(candidate);
    setCandidate('');
    fetchCandidates();
  };

  return (
    <div className="App">
      <button onClick={connectWallet} disabled={!!account}>
        {account ? `Connected: ${account.slice(0, 10)}...` : 'Connect Wallet'}
      </button>
      <p>{account ? 'You are currently connected!' : 'Please connect your wallet'}</p>

      {isAdmin && (
        <div id="admin">
          <input
            type="text"
            placeholder="Candidates (comma separated)"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Election Duration"
            value={electionDuration}
            onChange={(e) => setElectionDuration(e.target.value)}
          />
          <button onClick={startElection}>Start Election</button>
          <input
            type="text"
            placeholder="Add Candidate"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
          />
          <button onClick={addCandidate}>Add Candidate</button>
        </div>
      )}

      <div id="content" style={{ display: account ? 'block' : 'none' }}>
        <h2>Time Left: {timeLeft > 0 ? `${timeLeft} seconds` : "There's no election yet."}</h2>
        <div id="voteform" style={{ display: timeLeft > 0 ? 'flex' : 'none' }}>
          <select value={voteValue} onChange={(e) => setVoteValue(e.target.value)}>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button onClick={handleVote}>Vote</button>
        </div>
        <div id="showResultcont" style={{ display: timeLeft === 0 ? 'block' : 'none' }}>
          <button onClick={fetchResults}>Show Results</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Candidate</th>
                <th>Number of Votes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{result.name}</td>
                  <td>{result.numberOfVotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
