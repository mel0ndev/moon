//SPDX License Identifier: MIT
pragma solidity >=0.8.0;

interface IBaseAggregatedOracle {
    //@dev read functions
    function read() external view returns (uint256);

    //@dev write functions -- restricted to VMEX
    function update(uint256 newPrice) external;
}
