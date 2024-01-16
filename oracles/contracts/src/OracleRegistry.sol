//SPDX License Identifier: MIT
pragma solidity >=0.8.0; 


contract OracleRegistry {

	address internal temp; //TEMP

	//@dev used to identify what asset we're pricing, used for sorting	
	enum PriceFeedType {
		BASE,
		LP,
		VAULT
	}
	
	//@dev stores the address of the deployed feed for reading, as well as the type of feed being priced
	struct PriceFeed {
		address feedAddress; 	
		PriceFeedType feedType;
	}
	
	//we can still loop through these using feedCounter if needed;  
	mapping(uint256 => PriceFeed) public priceFeeds; 
	uint256 public feedCounter = 0; //acts like array.length

	error OracleAlreadyExists(); 

	event RemoveFeed(uint256 index); 
	event AddFeed(uint256 index, address indexed deployedFeedAddress, PriceFeedType typeOfFeed); 


	constructor() {
		//TEMP
		temp = msg.sender; 
	}

	modifier onlyGovernance() {
		require(msg.sender == temp, "onlyGovernance"); 
		_; 
	}


	//@dev adds a price feed to the mapping
	//TODO: refactor feedCounter to just be the index, not doing that now because testing other things, but will be good to do before deployment
	function addFeed(address deployedFeed, PriceFeedType typeOfFeed) external onlyGovernance {
			if (priceFeeds[indexToAddFeed].feedAddress == address(0)) {
				revert OracleAlreadyExists();    
			}

			priceFeeds[indexToAddFeed] = PriceFeed({
				feedAddress: deployedFeed,
				feedType: typeOfFeed
			}); 
			

			unchecked {
				feedCounter++; 
			}

			emit AddFeed(indexToAddFeed, deployedFeed, typeOfFeed); 

	}
	
	/*@dev only to be used when we are filling in a blank slot after removing a feed
	 * @param index - the index of the oracle to add
	 * @param deployedFeed - the address of the new feed to add
	 * @param typeOfFeed - the type of feed to add
	 */
	function addFeedAtIndex(uint256 index, address deployedFeed, PriceFeedType typeOfFeed) external onlyGovernance {
			if (priceFeeds[index].feedAddress == address(0)) {
				revert OracleAlreadyExists();    
			}
			priceFeeds[index] = PriceFeed({
				feedAddress: deployedFeed,
				feedType: typeOfFeed
			}); 
			
			unchecked {
				feedCounter++; 
			}

			emit AddFeed(index, deployedFeed, typeOfFeed); 
	}

	/*@dev removes a price feed from the mapping
	 * @param indexOfFeed - the index of the feed to remove
	*/
	function removeFeed(uint256 indexOfFeed) external onlyGovernance {
		priceFeeds[indexOfFeed].feedAddress = address(0); 							
		feedCounter -= 1;
		
		//can keep track of empty slots using events
		emit RemoveFeed(indexOfFeed); 
	}

}
