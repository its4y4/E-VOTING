// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 numberOfVotes;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;
    address[] public listOfVoters;
    uint256 public votingStart;
    uint256 public votingEnd;
    bool public electionStart;

    event ElectionStopped();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner has the right to start an election");
        _;
    }

    modifier electionOnGoing() {
        require(electionStart, "No ongoing election.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function startElection(string[] memory _candidates, uint256 _votingDuration) public onlyOwner {
        require(!electionStart, "An election is ongoing.");
        delete candidates;
        resetAllVoterStatus();

        for(uint256 i = 0; i < _candidates.length; i++) {
            candidates.push(Candidate({id: i, name: _candidates[i], numberOfVotes: 0}));
        }
        electionStart = true;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_votingDuration * 1 minutes);
    }

    function addCandidate(string memory _name) public onlyOwner electionOnGoing {
        require(block.timestamp < votingEnd, "The election has already finished.");
        candidates.push(Candidate({id: candidates.length, name: _name, numberOfVotes: 0}));
    }

    function stopElection() public onlyOwner {
        require(electionStart, "No ongoing election to stop.");
        electionStart = false;
        votingEnd = block.timestamp;
        emit ElectionStopped();
    }
    
    function voterStatus(address _voter) public view returns(bool) {
        return voters[_voter];
    }

    function vote(uint256 _id) public electionOnGoing {
        require(!voterStatus(msg.sender), "You have already voted.");
        require(_id < candidates.length, "Invalid Candidate ID.");

        candidates[_id].numberOfVotes++;
        voters[msg.sender] = true;
        listOfVoters.push(msg.sender);
    }

    function getVotes() public view returns (Candidate[] memory) {
        return candidates;
    }

    function electionTimer() public view electionOnGoing returns(uint256) {
        if(block.timestamp >= votingEnd) {
            return 0;
        } else {
            return (votingEnd - block.timestamp);
        }
    }

    function checkElectionPeriod() public returns(bool) {
        if(block.timestamp >= votingEnd) {
            electionStart = false;
            return false;
        } else {
            return true;
        }
    }

    function resetAllVoterStatus() public onlyOwner {
        for (uint256 i = 0; i < listOfVoters.length; i++){
            voters[listOfVoters[i]] = false;
        }
        delete listOfVoters;
    }
}
