const axios = require('axios'); 
require('dotenv').config(); 
const constants = require('./constants.ts'); 
const url = require('url'); 


const cmcAPIKey = process.env.PRO_API_KEY; 
const liveCoinWatchKey = process.env.LIVE_WATCH_KEY; 

//helpers
async function axiosQuery(url: string, endpoint?: string, params?: string): Promise<JSON> {
	const res = await axios.get(url + endpoint + params); 
	return res; 
}

module.exports = { getCoinPricesCoinGecko, getAllPrices, formatPricesByCoin }; 

async function getAllPrices(): Promise<Object> {
	const coinGeckoData = await getCoinPricesCoinGecko(); 		
	const cmcData = await getCoinPricesCMC(); 
	const gateData = await getCoinPricesGate(); 
//	const lcwData = await getCoinPricesLCW(); 
	const time = Date.now();  
	const prices = {
		time: time,
		coinPrices: {
				coinGecko: coinGeckoData,
				cmc: cmcData,
				gate: gateData,
	//		lcw: lcwData
		}
	}; 
	
	//console.log(prices); 
	return prices; 
}

//getAllPrices();  


//////////////////  COINGECKO ////////////////// 
async function getCoinPricesCoinGecko(): Promise<JSON> {
	const coinNames = constants.supportedCoinNames;  
	const formattedNames = getFormattedNamesAsString(coinNames); 
	const url = `https://api.coingecko.com/api/v3/simple/price?ids=${formattedNames}&vs_currencies=usd`
	const query = await axios.get(url); 

	return query.data; 
}


//////////////////  CMC ////////////////// 
async function getCoinPricesCMC(): Promise<Array<any>> { 
	const slugs: Array<string> = constants.supportedCoinSlugs;  
	const formattedSlugs= getFormattedNamesAsString(slugs); 
	const query =  await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${formattedSlugs}`, {
    headers: {                                                  
      'X-CMC_PRO_API_KEY': process.env.PRO_API_KEY              
    },                                                          
	}); 

	const array = Object.keys(query.data.data); 
	const coinsArray: any = []; 
	array.forEach(item => {
		const name: string = query.data.data[item].name; 
		const price: string = query.data.data[item].quote.USD.price; 
		const coin: any = {};  
		coin[name] = price; 
		coinsArray.push(coin); 
	}); 

	return coinsArray; 
}

//////////////////	GATE	////////////////// 
async function getCoinPricesGate(): Promise<Array<any>> {
	const pairs = constants.supportedCoinPairs; 
	let prices: Array<any> = []; 
	for await (let pair of pairs) {	
		const url = `https://api.gateio.ws/api/v4/spot/tickers?currency_pair=${pair}`; 
		const res = await axios.get(url);  
		prices.push({
			name: res.data[0].currency_pair,
			price: res.data[0].last
		}); 	
	}; 
	
	return prices; 

}

//////////////////	LCW		////////////////// 
async function getCoinPricesLCW(): Promise<any> {
	const symbols = constants.supportedCoinSymbols;  
	const requestData = {
	  codes: symbols,
	  currency: "USD",
	  sort: "rank",
	  order: "ascending",
	  offset: 0,
	  limit: 0,
	  meta: false,
	};
	
	const config = {
	  method: 'post',
	  url: 'https://api.livecoinwatch.com/coins/map',
	  headers: {
	    'content-type': 'application/json',
	    'x-api-key': liveCoinWatchKey,
	  },
	  data: JSON.stringify(requestData),
	};
	
	const res = await axios(config); 

	return res.data; 
} 



//////////////////	HELPERS ////////////////// 
//this function takes all the coin info from each of the data sources and combines them into one data structure
//an array of objects with nested objects containing prices listed under the coin's name
async function formatPricesByCoin(): Promise<object> {
	const coins: any = constants.coins; 
	const allPrices: any = await getAllPrices(); 
	let length: number; 
	for (let coin in coins) {
		coins[coin].push({"time": allPrices.time, "prices": []}); 
		length = coins[coin].length - 1; 
	}

	//format coingecko
	const coinGecko = allPrices.coinPrices["coinGecko"]; 
	for (let name in coinGecko) {
		const symbol: string = matchCoinToCoins("coinGecko", name.toString()); 
		//now we check that the coins data struct name matches with the one we just got
		for (let coin in coins) {
			if (coin.toString() == symbol) {
				coins[coin][length].prices.push(
					{coinGecko: coinGecko[name].usd}
				); 
			}
		}
	}

	const cmc = allPrices.coinPrices["cmc"]; 
	for (let name of cmc) {
		//have object with key pair, need just key
		const price = Object.values(name)[0]; 
		name = Object.keys(name)[0]; 
		const symbol: string = matchCoinToCoins("cmc", name.toString()); 
		for (let coin in coins) {
			if (coin.toString() == symbol) {
				coins[coin][length].prices.push(
					{cmc: price}
				); 
			}
		}
	}

	const gate = allPrices.coinPrices["gate"]; 
	for (let name of gate) {
		const price = Number(name.price); 
		name = name.name; 
		const symbol: string = matchCoinToCoins("gate", name.toString()); 
		console.log(symbol); 
		for (let coin in coins) {
			if (coin.toString() == symbol) {
				coins[coin][length].prices.push(
					{gate: price}
				); 
			}
		}
	}
	
	return coins; 	
}

//formatPricesByCoin(); 

//takes the given coin and matches it to the coins array 
function matchCoinToCoins(source: string, coin: string): string {
	let coinName: string; 
	switch(source) {
		default: {
			coinName = "Not Supported"; 
		}
		case "coinGecko": {
			switch(coin) {
				case "ethereum": {
					coinName = "ETH"; 
					break; 
				}	
				case "bitcoin": {
					coinName = "BTC";
					break; 
				}
				case "wrapped-steth": {
					coinName = "WSTETH"; 
					break; 
				}
				case "havven": {
					coinName = "SNX";
					break; 
				}
				case "optimism": {
					coinName = "OP"; 
					break; 
				}
				case "dai": {
					coinName = "DAI"; 
					break; 
				}
				case "usd-coin": {
					coinName = "USDC";
					break;
				}
				case "frax": {
					coinName = "FRAX";
					break; 
				}
				case "nusd": {
					coinName = "SUSD"; 
					break; 
				}
				case "tether": {
					coinName = "USDT";
					break;
				}
				case "liquity-usd": {
					coinName = "LUSD";
					break; 
				}
				case "rocket-pool-eth": {
					coinName = "RETH";
					break; 
				}
			}		
		}
		case "cmc": {
			switch(coin) {
				case "Ethereum": {
					coinName = "ETH"; 
					break; 
				}
				case "Bitcoin": {
					coinName = "BTC"; 
					break; 
				}
				case "Lido wstETH": {
					coinName = "WSTETH"; 
					break; 
				}
				case "Synthetix": {
					coinName = "SNX"; 
					break; 
				}
				case "Optimism": {
					coinName = "OP"; 
					break; 
				}
				case "Dai": {
					coinName = "DAI"; 
					break; 
				}
				case "USDC": {
					coinName = "USDC"; 
					break; 
				}
				case "Frax": {
					coinName = "FRAX"; 
					break; 
				}
				case "sUSD": {
					coinName = "SUSD"; 
					break; 
				}
				case "Tether USDt": {
					coinName = "USDT"; 
					break; 
				}
				case "Liquity USD": {
					coinName = "LUSD"; 
					break; 
				}
				case "Rocket Pool ETH": {
					coinName = "RETH"; 
					break; 
				}
			}	
		}
		case "gate": {
			switch (coin) {
				case "ETH_USDT": {
					coinName = "ETH"; 
					break; 
				}			
				case "BTC_USDT": {
					coinName = "BTC"; 
					break; 
				}
				case "SNX_USDT": {
					coinName = "SNX"; 
					break; 
				}
				case "OP_USDT": {
					coinName = "OP"; 
					break; 
				}
				case "DAI_USDT": {
					coinName = "DAI"; 
					break; 
				}
				case "USDC_USDT": {
					coinName = "USDC"; 
					break; 
				}
				case "FRAX_USDT": {
					coinName = "FRAX"; 
					break; 
				}
				case "SUSD_USDT": {
					coinName = "SUSD"; 
					break; 
				}
			}	
		}
	}
	
	return coinName; 
}

//matchCoinToCoins("gate", "ETH_USDT"); 

function getFormattedNamesAsString(coinNames: Array<string>): string {
	let bigString = ""; 	
	let length = coinNames.length; 
	coinNames.forEach((name, i) => {
		if (i == length - 1) {
			bigString += `${name}`; 
		} else {
			bigString += `${name},`; 
		}
	}); 
	return bigString; 
}


