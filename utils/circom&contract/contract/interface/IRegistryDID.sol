// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

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

    function getIssuer(
        string calldata did
    ) external view returns (IssuerInfo memory);
}
