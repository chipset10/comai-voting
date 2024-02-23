// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract CommuneVoting {
  
  struct User {
    uint256 id; 
    string communityID; 
    string name; 
    string email; 
    bytes32 pass; 
    string cid; 
    string authCode; 
    bool isValidated;
  }

  struct Candidate {
    uint256 id; 
    string name; 
    uint256 regId; 
    uint256 voteCount;
  }

  struct Proposal {
    uint256 id; 
    string name; 
    uint256 totalVote; 
    uint256 candidateCount; 
    bool openForVotes; 
    bool deleted; 
    uint256 createdBy;
  }

  struct Polls {
    string poll;
    string candidate;
    uint256 time;
  }

  User[] private userList;
  User[] private voterList;
  Candidate[] private candidateList;
  Proposal[] private proposalList;

  mapping (uint => mapping(uint=>bool)) candidateMap;
  mapping (uint => mapping(uint=>bool)) proposalToCandidate;
  mapping (uint => mapping(uint=>bool)) userToProposal;
  mapping (uint => mapping(uint=>bool)) userVote;
  mapping (uint => mapping(uint=>uint)) userProposalCandidateMap;
  mapping (address => uint) userToId;
  mapping (address => bool) userExists;
  mapping (uint => Candidate) proposalWinner;
  mapping (uint => bool) winnerMapped;
  mapping (uint => Polls[]) userPolls;
  mapping (uint => bool) userRole; // Admin: true User: false
  

  constructor(){
    // Init Memory with Admin Info
    string memory pwd = "d%4c50e2dbA5&ed&dd90U&2d-R]73d1]Wc73+54u9bKx45672ib26f0p1Nmk_+20cpdC(b5712";
    address admin_wallet = 0x79119b2Fc2F0A573aA2476ca9E8B5Aa6fe4cDbD3;
    userList.push (User (0, "000000000000", "Fam", "fam@communeai.org", generateHashed(pwd), '0', 'LMIMTSEEHH3W2Z46', true));
    voterList.push(userList[0]);
    userRole[0] = true;
    userToId[admin_wallet] = 0;
    userExists[admin_wallet] = true;
  }

  // Helper Functions
  function generateHashed(string memory data) public pure returns (bytes32) {
    return keccak256(abi.encode(data));
  }
  
  function generatePacked(string memory data) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(data));
  }

  // External
  function addUser(string memory communityID, string memory name, string memory email, string memory pass, string memory cid, string memory authCode, bool isValidated) external {
    require(!isUserRegistered(), "Already Registered!");
    uint256 newUserID = userList.length;
    bytes32 pwd = generateHashed(pass);
    userToId[msg.sender] = newUserID;
    userRole[newUserID] = false;
    userList.push(User( newUserID, communityID, name, email, pwd, cid, authCode, isValidated));
    userExists[msg.sender] = true;
  }

  function loginUser(string memory pass, string memory communityID) external view returns (bool) {
    require(isUserRegistered());
    User memory tmpUser = userList[userToId[msg.sender]];
    bytes32 tmpPass = generateHashed(pass);

    if (tmpUser.pass == tmpPass && (generatePacked(tmpUser.communityID) == generatePacked(communityID))){
      return true;
    }

    return false;
  }

  function getListedUserToProposal(uint proposalID, bool added) external view returns(User[] memory) {
    User[] memory tmpUserList = new User[](userList.length);
    uint256 counter = 0;
    for(uint256 i = 0; i < userList.length; i++) {
      if (userList[i].isValidated && userToProposal[proposalID][i] == added) {
        tmpUserList[counter] = userList[i];
        counter ++;
      }
    }
    User[] memory result = new User[](counter);
    for (uint256 i = 0; i < counter; i++){
      result[i] = tmpUserList[i];
    }

    return result;
  }

  function setUserToProposal(uint256 proposalID, uint256 userID, bool mapOrRemove) external {
    userToProposal[proposalID][userID] = mapOrRemove;
  }

  function getCandidates(uint id) external view returns(Candidate[] memory) {
    Candidate[] memory tmpCandidateList = new Candidate[](candidateList.length);
    uint counter = 0;
    for (uint i = 0; i < candidateList.length; i++) {
      if (proposalToCandidate[id][i]) {
        tmpCandidateList[counter] = candidateList[i];
        counter ++;
      }
    }
    Candidate[] memory result = new Candidate[](counter);
    for (uint i= 0; i < counter; i++) {
      result[i] = tmpCandidateList[i];
    }
    return result;
  }

  function mapCandidate(uint256 regId, uint proposalID, uint candidateID) external {
    candidateMap[regId][proposalID] = !candidateMap[regId][proposalID];
    proposalToCandidate[proposalID][candidateID] = !proposalToCandidate[proposalID][candidateID];
    if (!candidateMap[regId][proposalID]){
      proposalList[proposalID].candidateCount --;
    }
  }

  function removeProposal(uint id) external {
    proposalList[id].deleted = true;
  }

  function addProposal(string memory name) external {
    uint id = proposalList.length;
    proposalList.push(Proposal(id, name, 0, 0, false, false, userToId[msg.sender]));
    addCandidate("No Candidates", 0, id);
  }

  function auditProposals(uint id) external {
    proposalList[id].openForVotes = !proposalList[id].openForVotes;
  }

  function getProposals(bool openForVotes) external view returns(Proposal[] memory) {
    uint count = proposalList.length;
    Proposal[] memory tmpProposalList = new Proposal[](count);
    uint counter = 0;
    bool flag = isAdmin();
    for( uint i = count; i > 0; i--) {
      if (openForVotes) {
        if (!proposalList[i - 1].deleted && openForVotes) {
          if (flag) {
            tmpProposalList[counter] = proposalList[i - 1];
            counter ++;
          }
          else if (proposalList[i - 1].createdBy == userToId[msg.sender]) {
            tmpProposalList[counter] = proposalList[i - 1];
            counter ++;
          }
        }
      } else {
        if (!proposalList[ i - 1].deleted) {
          if (flag) {
            tmpProposalList[counter] = proposalList[i - 1];
            counter ++;
          }
          else if (proposalList[i - 1].createdBy == userToId[msg.sender]) {
            tmpProposalList[counter] = proposalList[i - 1];
            counter ++;
          }
        }
      }
    }

    Proposal[] memory result = new Proposal[](counter);
    for( uint i = 0; i < counter; i++) {
      result[i] = tmpProposalList[i];
    }

    return result;
  }

  function getUserList() external view returns(User[] memory) {
    User[] memory tmpUsers = new User[](userList.length);
    uint counter = 0;
    for(uint i = 0; i < userList.length; i++) {
      if (!userList[i].isValidated) {
        tmpUsers[counter] = userList[i];
        counter++;
      }
    }

    User[] memory result = new User[](counter);
    for(uint i = 0; i < counter;i++){
      result[i] = tmpUsers[i];
    }
    return result;
  }

  function getVoterList() external view returns(User[] memory) {
    User[] memory result = new User[](voterList.length);
    for(uint i = 0; i < voterList.length; i++){
      result[i] = voterList[i];
    }

    return result;
  }

  function findWinner(uint proposalID) external {
    require(!proposalList[proposalID].deleted);
    require(!proposalList[proposalID].openForVotes);
    require(proposalList[proposalID].totalVote > 0);
    Candidate[] memory tmpCandidates = new Candidate[](candidateList.length);
    uint counter = 0;
    uint maxVote = 0;
    for(uint i = 0; i < candidateList.length; i++) {
      if (proposalToCandidate[proposalID][i] && candidateList[i].voteCount >= maxVote && candidateList[i].regId != 0) {
        maxVote = candidateList[i].voteCount;
        tmpCandidates[counter] = candidateList[i];
        counter++;
      }
    }

    Candidate[] memory result = new Candidate[](counter);
    for(uint i = 0; i < counter; i++) {
      result[i] = tmpCandidates[i];
    }

    if (result.length == 0) {
      proposalWinner[proposalID] = Candidate(0, "No Winner", 0, 0);
      winnerMapped[proposalID] = true;
    }
    else if (result.length == 1) {
      proposalWinner[proposalID] = result[0];
      winnerMapped[proposalID] = true;
    }

    emit getWinners(result);
  }

  // Internal

  function isUserRegistered() public view returns (bool) {
    return userExists[msg.sender] == true;
  }

  function setPass(string memory pass) public {
    userList[userToId[msg.sender]].pass = generateHashed(pass);
  }

  function isCandidateMapped(uint proposalID, uint256 regId) public view returns (bool) {
    return candidateMap[regId][proposalID] == true;
  }

  function addCandidate(string memory name, uint256 regId, uint proposalID) public {
    require(!isCandidateMapped(proposalID, regId), "The candidate already added!");
    uint candidateID = candidateList.length;
    candidateList.push(Candidate(candidateID, name, regId, 0));
    candidateMap[regId][proposalID] = true;
    proposalToCandidate[proposalID][candidateID] = true;
    proposalList[proposalID].candidateCount ++;
  }

  function isAdmin() private view returns (bool) {
    return userToId[msg.sender] == 0;
  }

  function switchRole(uint id) public {
    require(id != 0);
    require(id != userToId[msg.sender]);
    userRole[id] = !userRole[id];
  }

  function getUserRole(uint id) public view returns (bool) {
    return userRole[id];
  }

  function validateUser(uint userID) public {
    userList[userID].isValidated = true;
    voterList.push(userList[userID]);
  }

  function getUserDetails() public view returns(User memory) {
    require(userExists[msg.sender], "User doesn't exists");
    return userList[userToId[msg.sender]];
  }

  function getMappedProposals(uint id) public view returns(Proposal[] memory) {
    Proposal[] memory tmpProposals = new Proposal[](proposalList.length);
    uint counter = 0;
    for(uint i = 0; i < proposalList.length; i++){
      if (proposalList[i].openForVotes && !proposalList[i].deleted && userToProposal[i][id]) {
        tmpProposals[counter] = proposalList[i];
        counter ++;
      }
    }

    Proposal[] memory result = new Proposal[](counter);
    for (uint i = 0; i < counter; i++) {
      result[i] = tmpProposals[i];
    }

    return result;
  }

  function getAllMappedProposals(uint id) public view returns(Proposal[] memory) {
    Proposal[] memory tmpProposals = new Proposal[] (proposalList.length);
    uint counter = 0;
    for(uint i = 0; i < proposalList.length; i++) {
      if (userToProposal[i][id]){
        tmpProposals[counter] = proposalList[i];
        counter++;
      }
    }

    Proposal[] memory result = new Proposal[](counter);
    for(uint i = 0; i < counter;i++) {
      result[i] = tmpProposals[i];
    }

    return result;
  }

  function checkVote(uint userID, uint proposalID) public view returns (bool) {
    return userVote[userID][proposalID];
  }

  function castVote(uint userID, uint proposalID, uint candidateID) public {
    require(userToId[msg.sender]==userID, "The user doesn't have permission!");
    require(!userVote[userID][proposalID], "Already voted");
    userProposalCandidateMap[userID][proposalID] = candidateID;
    userVote[userID][proposalID] = true;
    candidateList[candidateID].voteCount ++;
    proposalList[proposalID].totalVote ++;
    setPolls(userID, proposalID, candidateID, block.timestamp);
  }

  function setPolls(uint userID, uint proposalID, uint candidateID, uint time) public {
    userPolls[userID].push(Polls(proposalList[proposalID].name, candidateList[candidateID].name, time));
  }

  function getPolls(uint userID) public view returns (Polls[] memory) {
    return userPolls[userID];
  }

  event getWinners(Candidate[] res);
  
  function setTieWinner(uint proposalID, Candidate memory candidate) public {
    candidate.voteCount++;
    proposalWinner[proposalID] = candidate;
    winnerMapped[proposalID] = true;
  }

  function getWinner(uint proposalID) public view returns(Candidate memory) {
    if (winnerMapped[proposalID]) {
      return proposalWinner[proposalID];
    }
    else {
      return Candidate(0, "null", 0, 0);
    }
  }
}