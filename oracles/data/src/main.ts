//NOTE: each api will have a function here that gets the appropriate data for each coin we have
const coinInfo = require("./periphery/getCoinInfo.ts"); //????
const coinNameAndSymbols = require("./periphery/constants.ts"); 
const ethers = require("ethers"); require('dotenv').config(); 
const fs = require('fs'); 
//const provider = new ethers.AlchemyProvider('optimism', process.env.OP_API_KEY);  
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); 
const oracleRegistryAddress: string = "0xcA03Dc4665A8C3603cb4Fd5Ce71Af9649dC00d44"; 
const oracleRegistryAbi = require("../../contracts/out/OracleRegistry.sol/OracleRegistry.json").abi; 
const baseOracleAbi = require("../../contracts/out/BaseAggregatedOracle.sol/BaseAggregatedOracle.json").abi; 
const oracleRegistry: any = new ethers.Contract(
	oracleRegistryAddress, 
	oracleRegistryAbi,
	provider
); 

const signer = new ethers.Wallet(
	process.env.TESTING_PRIVATE_KEY,
	provider
);

const PRICE_LENGTH: number = 4; //4 intervals in an hour, this can be changed depending on how many price samples we want per hour

//this service does not have to be running at all time, a cron job just has to call main() every 15 minutes,
//if there are enough entries in prices.json, it will execute the rest of the function and push prices on-chain.
async function main(): Promise<void> {	
	//get prices every 15 mins
	const coinPrices: any = await fetchPrices(); 
	//check the length of them, if they are >= PRICE_LENGTH, we push them to the chain,
	//if not, we append them to the file until we have 4
	const currentLengthOfPrices: number = await getPriceLength(); 	
		if (currentLengthOfPrices  >= PRICE_LENGTH - 1) {	
			console.log("it ran"); 
			//PRICE_LENGTH - 1 indicates that we are running on the 4th iteration, in which case we will still want to push prices to the chain
			//but we do not want to overwrite old data in this case, so we need to skip checking for removing the oldest timestamp
			
			//if we already have enough samples, we want to overwrite the old data, and replace it with the newest price information before we calculate a median
			if (currentLengthOfPrices == PRICE_LENGTH) {
				removeOldestTimestamp();
				readAndAppendDataToPricesJSONFile(coinPrices); 
			}

			//get the median of prices
			const medianPrices = getMedianPrices(); 

			////store median in another file (to examine if needed, or if backup is needed)
			writeToJSONFile("./src/aggregatedPrice.json", JSON.stringify(medianPrices, null, 3)); 

			////send to chain
			writeTwapDataToChain(); 
		
		} else {
			if (currentLengthOfPrices == 0) {
				writeToJSONFile('./src/prices.json', JSON.stringify(coinPrices, null, 3)); 
			} else {
				//append new prices to prices.json
				readAndAppendDataToPricesJSONFile(coinPrices); 
			}
					
		}
}

main(); 

//this is called every minute, contents are dumped into prices.json
//we also check that the file exists, and if it's been written to already
//if it has, we find the correct coin entry, and then append the new prices array to it with the time
//if not, we write the first entry to the file
async function fetchPrices(): Promise<object> { 
	const coinPrices = await coinInfo.formatPricesByCoin(); 
	console.log(coinPrices); 
	return coinPrices; 
}

//fetchPrices(); 

//read file and aggregate prices 
function readFromJSONFile(path: string): Array<any> {
	let raw = fs.readFileSync(path, 'utf8', (error: any) => {
		if (error) throw error; 
	}); 
	let parsed = JSON.parse(raw); 
	return parsed; 
}

//takes in coinPrices as a string, finds the correct entry in the array and file and appends the new data
function readAndAppendDataToPricesJSONFile(data: Array<string>): void {
	const parsedData = readFromJSONFile("./src/prices.json"); 
	for (let coin in parsedData) { //coin == coinName {  }
		parsedData[coin].push(data[coin][0]); 
	}

	writeToJSONFile("./src/prices.json", JSON.stringify(parsedData, null, 3)); 
}

async function writeToJSONFile(path: string, data: string): Promise<void> {
	fs.writeFileSync(path, data, (error: any) => {
		if (error) throw error; 
	}); 	
}	

async function checkIfFileHasBeenWrittenTo(path: string): Promise<boolean> {
		if (!fs.existsSync(path)) {
			console.log("file not found"); 
		} else {
				let fileHandler = await fs.promises.open('src/prices.json'); 
				const fileRawData = await fileHandler.read();  
				if (Number(fileRawData.bytesRead) != 0) {
					return true; 					
				}
		}

		return false; 
}

function removeOldestTimestamp(): void {
		//TODO: loop through and find the oldest timestamp
	const parsedData = readFromJSONFile("./src/prices.json"); 
	for (let coin in parsedData) { 
		parsedData[coin].shift(); 
	}
	
	writeToJSONFile("./src/prices.json", JSON.stringify(parsedData, null, 3)); 
}

async function getPriceLength(): Promise<number> {
	const path = ("./src/prices.json"); 
	const hasBeenWrittenTo: boolean = await checkIfFileHasBeenWrittenTo(path); 	
	let priceLength: number = 0; 
	if (hasBeenWrittenTo == false) {
		return priceLength; 
	} else {
		const parsedJSON = readFromJSONFile("./src/prices.json"); 		
		for (let coin in parsedJSON) {
			priceLength = parsedJSON[coin].length; 
			break; 
		}
	}

	return priceLength; 	
}

//getPriceLength(); 

function getMedianPrices(): Array<object> {
	let medianPrices: Array<object> = []; 

	const parsedData = readFromJSONFile("./src/prices.json"); 
	for (let coinName in parsedData) { 
		console.log(coinName); 
		let sortedPrices: Array<any> = []; 
		const coinObjects = parsedData[coinName]; 
		for (let entry of coinObjects) {
			let prices = entry.prices; 
			for (let price of prices) {
				const arrayOfPrices = Object.values(price); 
				sortedPrices.push(arrayOfPrices[0]); 
			}
		}
		sortedPrices = sortedPrices.sort(function (a: any, b: any){return a - b}); 
		const median = calculateMedian(sortedPrices); 
		const coin = {
				[coinName]: median	
			}; 

		medianPrices.push(coin); 

	}

	return medianPrices; 

}

//getMedianPrices(); 

function calculateMedian(array: Array<number>): number {
	const mid = Math.floor(array.length / 2); 
	let median: number; 	

	if (array.length % 2 == 0) {
		median = (array[mid - 1] + array[mid]) / 2; 
	} else {
		median = array[mid]; 
	}

	return median; 
}


//loop through stored prices for each 15 minute interval
//we are querying every minute and creating a twap of those 15 minutes based on the 15 previous price closes
function createTwap(): Array<object> {
	const parsedData = readFromJSONFile("./src/prices.json"); 
	let averageCG: number = 0; 
	let averageCMC: number = 0; 
	
	let aggregatedPrices = []; 

	for (let coinName in parsedData) { 
		const coinObjects = parsedData[coinName]; 
		let cgNum: number = 0; 
		let cmcNum: number = 0; 
		let priceLength: number = coinObjects.length; 
		for (let entry of coinObjects) {
			for (let i in entry.prices) {
				if (entry.prices[i].hasOwnProperty("coinGecko")) {
					let price = entry.prices[i].coinGecko; 
					cgNum += price; 
				} else if (entry.prices[i].hasOwnProperty("cmc")) {
					let price = entry.prices[i].cmc; 
					cmcNum += price; 
				}
			}
		}
	
		averageCG = cgNum / priceLength; 
		averageCMC = cmcNum / priceLength; 

		let coinStruct = {
			coinName: coinName,
			aggCG: averageCG,
			aggCMC: averageCMC	
		}; 

		aggregatedPrices.push(coinStruct); 

	}

	return aggregatedPrices; 
} 

function getAggregatedPriceBySymbol(coinSymbol: string): number {
		const parsedJSON = readFromJSONFile("./src/aggregatedPrice.json");  
		let finalPrice: number; 
		for (let entry of parsedJSON) {
			let coinName = Object.keys(entry)[0]; 
			if (coinName == coinSymbol) {
				finalPrice = Number(Object.values(entry)[0]); 
			}
		}
		
		//TODO: This needs to be scaled still by token decimals
		return Number(finalPrice.toFixed(0)); 
}

async function writeTwapDataToChain(): Promise<void> {
	coinNameAndSymbols.assignSymbolsToFeeds(); 
	const feedLength: any = await oracleRegistry.feedCounter(); 	
	console.log(feedLength); 
	for (let i = 0; i < Number(feedLength); i++) {
		let [feed, index] = await oracleRegistry.priceFeeds(i + 1); 
		const contract: any = new ethers.Contract(feed, baseOracleAbi, signer); 
		const coinSymbol: string = coinNameAndSymbols.feedMap.get(feed); 
		console.log(coinSymbol); 
		const price: number = getAggregatedPriceBySymbol(coinSymbol);  
		console.log(price); 
		const account = await signer.getAddress(); 
		await contract.update(price); 
		const priceFromContract = await contract.read(); 
		const name: string = await contract.name(); 
		console.log(`feed ${name} updated to: ${priceFromContract}`); 
	}
}

//writeTwapDataToChain(); 
