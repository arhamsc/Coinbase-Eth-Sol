// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17.0;

//FACTORY CONTRACT - responsible to deploy Campaign Contract, it also will contain the addresses of all the campaigns contracts
contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request { //Brand new type into the contract
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount; //yes votes
        mapping(address => bool) approvals; //these are people who have approved
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount; //because we cannot do any iterations in mapping above

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
        approversCount = 0;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true; //it is true because if the sender doesnt exist then it returns false telling it is not a contributor
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        // require(approvers[msg.sender]); //if that person has donated then block returns true else false

        // TypeError: Data location must be "storage", "memory" or "calldata" for variable, but none was given.
        // Request memory newRequest = Request({ //There is no similar variable that exists inside the storage, therefore it should be "memory"
        //     description: description,
        //     value: value,
        //     recipient: recipient,
        //     complete: false,
        //     approvalCount: 0 //we need not initialise the reference types
        // });
        //Because compiler complains for mapping inside a struct
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        //Alternative Syntax for structs, but not recommended
        //Request(descirption, value, recipient, false);

        // requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index]; //storage keyword makes such that we mutate the original item in storage

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]); //if he has already voted then exit

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount / 2)); //more than 50% people must approve
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    //Wrong Approach
    //But WHY?:- Assume that first for loop takes 10,000 gas per person
    //And second for loop costs 5,000 gas per person
    //10,000 * 1 contributor + 5,000 * 1 contributor = 15,000 gas/person
    //But we should allow a voting system for thousands of contributors
    //If we have 10,000 contributors total will be 100,015,000 gas is spent.
    // function approveRequest(Request memory request) public {
    //     bool isApprover = false;
    //     for(uint i = 0; i <approvers.length;i++) {
    //         if(approvers[i] == msg.sender) {
    //             isApprover = true;
    //         }
    //     }

    //     require(isApprover);

        //Make sure caller hasnt voted
    //     for(uint i = 0; i<request.approvers.length; i++) {
    //         require(request.approvers[i] != msg.sender);
    //     }
    // }
}