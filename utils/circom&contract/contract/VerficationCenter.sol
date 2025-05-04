// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IRegistryDID.sol";
import "./interfaces/IVerifier.sol";
import "./libraries/verifierInputFormat.sol";

contract VerificationCenter {
    using VerifierInputFormat for bytes32;

    IRegistryDID registryDID;
    IVerifier verifier;

    constructor(address _registryDID, address _verifier) {
        registryDID = IRegistryDID(_registryDID);
        verifier = IVerifier(_verifier);
    }

    function verifyOnEd25519(
        string calldata issuerDID,
        bytes calldata proofs,
        bytes32 major
    ) public view returns (bool result) {
        IRegistryDID.IssuerInfo memory issuer = registryDID.getIssuer(
            issuerDID
        );
        bytes32 issuerPubKey = bytes32(issuer.pubKey);
        require(
            bytes32(issuerPubKey) != bytes32(0x0),
            "Can not find public key of issuer"
        );

        (uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c) = abi
            .decode(proofs, (uint256[2], uint256[2][2], uint256[2]));

        (uint256 firstHalfPubKey, uint256 secondHalfPubKey) = issuerPubKey
            .changeBytes32ToVerifierInputFormat();

        uint256[3] memory input = [
            (firstHalfPubKey),
            (secondHalfPubKey),
            uint256(major)
        ];

        result = verifier.verifyProof(a, b, c, input);
    }
}
