// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IRegistryDID {
    struct IssuerInfo {
        bool isRegistered;
        bytes pubKey;
        string signatureAlgorithm;
        string name;
        string symbol;
    }

    event AcceptedIssuer(string indexed did);
    event DeclinedIssuer(string indexed did);
    event RemovedIssuer(string indexed did, string reason);

    function registerIssuer(
        string calldata did,
        IssuerInfo calldata issuerInfo
    ) external;

    function acceptIssuer(string calldata did) external;

    function declineIssuer(string calldata did) external;

    function removeIssuer(string calldata did, string calldata reason) external;

    function getIssuer(string calldata did) external view returns (IssuerInfo memory);

    function getWaitingDIDs() external view returns (string[] memory);
}

contract RegistryDID is IRegistryDID, Ownable {
    mapping(string => IssuerInfo) public issuers;
    mapping(string => IssuerInfo) public waitingAcceptIssuers;
    string[] private waitingList;

    constructor() Ownable(msg.sender) {}

    function registerIssuer(
        string calldata did,
        IssuerInfo calldata issuerInfo
    ) public override {
        require(!issuers[did].isRegistered, "DID already accepted");
        require(!waitingAcceptIssuers[did].isRegistered, "DID already pending");
        require(issuerInfo.pubKey.length > 0, "Public key required");
        require(bytes(issuerInfo.signatureAlgorithm).length > 0, "Signature algorithm required");

        waitingAcceptIssuers[did] = IssuerInfo({
            isRegistered: true,
            pubKey: issuerInfo.pubKey,
            signatureAlgorithm: issuerInfo.signatureAlgorithm,
            name: issuerInfo.name,
            symbol: issuerInfo.symbol
        });

        waitingList.push(did);
    }

    function acceptIssuer(string calldata did) public override onlyOwner {
        IssuerInfo memory pending = waitingAcceptIssuers[did];
        require(pending.isRegistered, "DID did not register");

        issuers[did] = pending;
        delete waitingAcceptIssuers[did];
        _removeFromWaitingList(did);

        emit AcceptedIssuer(did);
    }

    function declineIssuer(string calldata did) public override onlyOwner {
        require(waitingAcceptIssuers[did].isRegistered, "DID did not register");

        delete waitingAcceptIssuers[did];
        _removeFromWaitingList(did);

        emit DeclinedIssuer(did);
    }

    function removeIssuer(
        string calldata did,
        string calldata reason
    ) public override onlyOwner {
        require(issuers[did].isRegistered, "DID is not an accepted issuer");

        delete issuers[did];

        emit RemovedIssuer(did, reason);
    }

    function getIssuer(
        string calldata did
    ) external view override returns (IssuerInfo memory) {
        return issuers[did];
    }

    function getWaitingDIDs() external view override returns (string[] memory) {
        return waitingList;
    }

    function _removeFromWaitingList(string calldata did) internal {
        uint len = waitingList.length;
        for (uint i = 0; i < len; i++) {
            if (keccak256(bytes(waitingList[i])) == keccak256(bytes(did))) {
                waitingList[i] = waitingList[len - 1];
                waitingList.pop();
                break;
            }
        }
    }
} 