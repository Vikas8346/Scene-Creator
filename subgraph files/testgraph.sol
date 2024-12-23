// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

contract testContract {
    uint256 value;

    // Define an event to log when the value changes
    event ValueChanged(uint256 newValue);

    constructor(uint256 _p) {
        value = _p;
        emit ValueChanged(_p);  // Emit event in constructor
    }

    function setP(uint256 _n) payable public {
        value = _n;
        emit ValueChanged(_n);  // Emit event when value is updated
    }

    function setNP(uint256 _n) public {
        value = _n;
        emit ValueChanged(_n);  // Emit event when value is updated
    }

    function get() view public returns (uint256) {
        return value;
    }
}
