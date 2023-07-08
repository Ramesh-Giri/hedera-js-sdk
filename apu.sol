// SPDX-License-Identifier: MIT


pragma solidity ^0.8.13;

import "./node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract APUToken is ERC20 {
    address private owner;
    
    constructor() ERC20("Ramesh Token", "RG") {
        owner = msg.sender;
        _mint(msg.sender, 50000000000 * 10 ** decimals());
    }
}