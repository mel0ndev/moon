//SPDX License Identifier: MIT
pragma solidity >=0.8.0;

import {OracleRegistry} from "./OracleRegistry.sol";
import {IBaseAggregatedOracle} from "./interfaces/IBaseAggregatedOracle.sol";

contract BaseAggregatedOracle is IBaseAggregatedOracle {
    address public updater; //verified address that can update price feeds
    uint256 public index;
    uint256 internal price;

    string public name; //naming convention is: {TOKEN}_BASE, {TOKEN_0}_{TOKEN_1}_LP_{PROTOCOL}, {TOKEN}_VAULT_{PROTOCOL}

    bool public deprecated = false;

    modifier onlyUpdater() {
        require(msg.sender == updater, "only updater");
        _;
    }

    constructor(address _updater, string memory _name) {
        updater = _updater;
        name = _name;
    }

    //@dev returns the current aggregated price for the feed
    function read() external view returns (uint256) {
        require(deprecated == false, "feed has been deprecated, do not use!");
        return price;
    }

    //@dev updates the price for this specific contract
    function update(uint256 newPrice) external onlyUpdater {
        require(deprecated == false, "feed has been deprecated, do not use!");
        price = newPrice;
    }

    function deprecate() external onlyUpdater {
        //can be Governance voted if we want
		//for now this is fine
        deprecated = true;
    }
}
