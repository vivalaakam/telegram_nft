// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Verification is Ownable {
    mapping(uint => address) public verified;

    constructor() Ownable(msg.sender) {}

    function verify(uint256 _id, address _address) public onlyOwner {
        verified[_id] = _address;
    }
}
