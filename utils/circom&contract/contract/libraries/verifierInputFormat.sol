// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library VerifierInputFormat {
    function changeBytes32ToVerifierInputFormat(
        bytes32 self
    ) internal pure returns (uint256 firstHalf, uint256 secondHalf) {
        bytes32 pubKeyLeFormat = convertToLittleEndian(self);
        (
            bytes16 firstHalfLeFormat,
            bytes16 secondHalfLeFormat
        ) = splitBytes32AndSwap(pubKeyLeFormat);

        firstHalf = uint256(bytes32(firstHalfLeFormat) >> (16 * 8));
        secondHalf = uint256(bytes32(secondHalfLeFormat) >> (16 * 8));
    }

    function splitBytes32AndSwap(
        bytes32 input
    ) internal pure returns (bytes16, bytes16) {
        bytes16 firstHalf = bytes16(input);
        bytes16 secondHalf = bytes16(input << 128);
        return (secondHalf, firstHalf);
    }

    function convertToLittleEndian(
        bytes32 input
    ) internal pure returns (bytes32) {
        bytes32 output;
        for (uint256 i = 0; i < 32; i++) {
            bytes32 nextByte;
            nextByte = input[i];
            output |= nextByte >> ((31 - i) * 8);
        }

        return output;
    }
}
