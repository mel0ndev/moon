//maps the coin symbol to the deployed feed address
let feedMap = new Map<string, string>(); 

//since we're not storing anything in memory we need to map everything each time
//shouldn't be too bad on performance 
function assignSymbolsToFeeds(): void {
	feedMap.set("0x2dE080e97B0caE9825375D31f5D0eD5751fDf16D", "ETH");  
}


const supportedCoins = [ //OP
	"0x4200000000000000000000000000000000000006",
	"0x68f180fcce6836688e9084f035309e29bf0a2095",
	"0x1f32b1c2345538c0c6f582fcb022739c4a194ebb",
	"0x8700daec35af8ff88c16bdf0418774cb3d7599b4",
	"0x4200000000000000000000000000000000000042",
	"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
	"0x7f5c764cbc14f9669b88837ca1490cca17c31607",
	"0x2e3d870790dc77a83dd1d18184acc7439a53f475",
	"0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9",
	"0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
	"0xc40f949f8a4e094d1b49a23ea9241d289b7b2819",
	"0x9bcef72be871e61ed4fbbc7630889bee758eb81d",	
]; 

//coingecko
const supportedCoinNames = [
	"ethereum",
	"bitcoin",
	"wrapped-steth",
	"havven", //this is synthetix
	"optimism",
	"dai",
	"usd-coin",
	"frax",
	"nusd", //this is susd
	"tether",
	"liquity-usd",
	"rocket-pool-eth",
];

//cmc
const supportedCoinSlugs = [
	"ethereum",
	"bitcoin",
	"lido-finance-wsteth",
	"synthetix",
	"optimism-ethereum",
	"multi-collateral-dai",
	"usd-coin",
	"frax",
	"susd",
	"tether",
	"liquity-usd",
	"rocket-pool-eth",
]; 

const supportedCoinPairs = [
	"ETH_USDT",
	"BTC_USDT",
	"SNX_USDT",
	"OP_USDT",
	"DAI_USDT",
	"USDC_USDT",
	"FRAX_USDT",
	"SUSD_USDT",
]; 

const supportedCoinSymbols = [
	"ETH",
	"BTC",
	"WSTETH",
	"SNX",
	"OP",
	"DAI",
	"USDC",
	"FRAX",
	"LUSD",
	"SUSD",
	"USDT",
	"__RETH"
]; 

const coins = {
	ETH: [] as Object[],
	BTC: [] as Object[],
	WSTETH: [] as Object[],
	SNX: [] as Object[],
	OP: [] as Object[],
	DAI: [] as Object[],
	USDC: [] as Object[],
	FRAX: [] as Object[],
	LUSD: [] as Object[],
	SUSD: [] as Object[],
	USDT: [] as Object[],
	RETH: [] as Object[],
}; 

const supportedLPTokens = [
	"0x061b87122Ed14b9526A813209C8a59a633257bAb",
	"0xB90B9B1F91a01Ea22A182CD84C1E22222e39B415",
	"0x6dA98Bde0068d10DDD11b468b197eA97D96F96Bc",
	"0x6d5BA400640226e24b50214d2bBb3D4Db8e6e15a",
	"0x7e0F65FAB1524dA9E2E5711D160541cf1199912E", 
	"0x0493Bf8b6DBB159Ce2Db2E0E8403E753Abd1235b",
	"0xd25711EdfBf747efCE181442Cc1D8F5F8fc8a0D3",
	"0x0df083de449F75691fc5A36477a6f3284C269108",
	"0x6387765fFA609aB9A1dA1B16C455548Bfed7CbEA",
	"0x19715771E30c93915A5bbDa134d782b81A820076",
	"0xf04458f7B21265b80FC340dE7Ee598e24485c5bB",
	"0x2B47C794c3789f499D8A54Ec12f949EeCCE8bA16",
]; 

const supportedVaultTokens = [
	"0xaD17A225074191d5c8a37B50FdA1AE278a2EE6A2",
	"0x65343F414FFD6c97b0f6add33d16F6845Ac22BAc",
	"0xFaee21D0f0Af88EE72BB6d68E54a90E6EC2616de",
	"0x5B977577Eb8a480f63e11FC615D6753adB8652Ae",
]; 

const coinGeckoURL = "https://api.coingecko.com/api/v3/"

module.exports = { 
	supportedCoins, 
	supportedCoinNames,
	supportedCoinSlugs,
	supportedCoinSymbols,
	supportedCoinPairs,
	supportedLPTokens, 
	supportedVaultTokens,
	coinGeckoURL,
	coins,
	feedMap,
	assignSymbolsToFeeds
}; 
