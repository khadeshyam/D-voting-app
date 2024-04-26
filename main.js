let WALLET_CONNECTED = "";
let contractAddress = "0x974d14c64224c8cE20c26C3DEf7e116D356D714E";
let contractAbi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
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
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandiates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
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
      "inputs": [],
      "name": "getRemainingTime",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getVotesOfCandiate",
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
      "name": "getVotingStatus",
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
          "internalType": "uint256",
          "name": "_candidateIndex",
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

const connectMetamask = async() => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        WALLET_CONNECTED = await signer.getAddress();
        var element = document.getElementById("metamasknotification");
        element.innerHTML = "Metamask is connected " + WALLET_CONNECTED;
    } catch (error) {
        console.error("Error connecting to Metamask: ", error);
    }
}

const addVote = async() => {
    try {
        if(WALLET_CONNECTED != 0) {
            console.log("Adding vote");
            var name = document.getElementById("vote");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            var cand = document.getElementById("cand");
            cand.innerHTML = "Please wait, adding a vote in the smart contract";
            const tx = await contractInstance.vote(name.value);
            console.log(tx);
            await tx.wait();
            cand.innerHTML = "Vote added !!!";
        }
        else {
            var cand = document.getElementById("cand");
            cand.innerHTML = "Please connect metamask first";
        }
    } catch (error) {
        if (error.data && error.data.message && error.data.message.includes('You have already voted.')) {
            var cand = document.getElementById("cand");
            cand.innerHTML = "You have already voted.";
        } else {
            console.error("Error adding vote: ", error);
        }
    }
}

const voteStatus = async() => {
    try {
        if(WALLET_CONNECTED != 0) {
            var status = document.getElementById("status");
            var remainingTime = document.getElementById("time");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            const currentStatus = await contractInstance.getVotingStatus();
            const time = await contractInstance.getRemainingTime();
            console.log(time);
            status.innerHTML = currentStatus == 1 ? "Voting is currently open" : "Voting is finished";
            remainingTime.innerHTML = `Remaining time is ${parseInt(time, 16)} seconds`;
        }
        else {
            var status = document.getElementById("status");
            status.innerHTML = "Please connect metamask first";
        }
    } catch (error) {
        console.error("Error getting vote status: ", error);
    }
}

const getAllCandidates = async() => {
    try {
        if(WALLET_CONNECTED != 0) {
            var p3 = document.getElementById("p3");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            p3.innerHTML = "Please wait, getting all the candidates from the voting smart contract";
            var candidates = await contractInstance.getAllVotesOfCandiates();
            console.log(candidates);
            var table = document.getElementById("myTable");

            for (let i = 0; i < candidates.length; i++) {
                var row = table.insertRow();
                var idCell = row.insertCell();
                var descCell = row.insertCell();
                var statusCell = row.insertCell();

                idCell.innerHTML = i;
                descCell.innerHTML = candidates[i].name;
                statusCell.innerHTML = candidates[i].voteCount;
            }

            p3.innerHTML = "The tasks are updated"
        }
        else {
            var p3 = document.getElementById("p3");
            p3.innerHTML = "Please connect metamask first";
        }
    } catch (error) {
        console.error("Error getting all candidates: ", error);
    }
}

const getElectionWinner = async() => {
    try {
        if(WALLET_CONNECTED != 0) {
            var winnerElement = document.getElementById("winner");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            winnerElement.innerHTML = "Please wait, getting all the candidates from the voting smart contract";
            var candidates = await contractInstance.getAllVotesOfCandiates();
            console.log(candidates);

            var winner = candidates[0];
            for (let i = 1; i < candidates.length; i++) {
                if (candidates[i].voteCount > winner.voteCount) {
                    winner = candidates[i];
                }
            }

            winnerElement.innerHTML = `The winner is ${winner.name} with ${winner.voteCount} votes`;
        }
        else {
            var winnerElement = document.getElementById("winner");
            winnerElement.innerHTML = "Please connect metamask first";
        }
    } catch (error) {
        console.error("Error getting the election winner: ", error);
    }
}