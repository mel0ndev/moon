var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var axios = require('axios');
require('dotenv').config();
var constants = require('./constants.ts');
var url = require('url');
var cmcAPIKey = process.env.PRO_API_KEY;
var liveCoinWatchKey = process.env.LIVE_WATCH_KEY;
function axiosQuery(url, endpoint, params) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, axios.get(url + endpoint + params)];
                case 1:
                    res = _a.sent();
                    return [2, res];
            }
        });
    });
}
module.exports = { getCoinPricesCoinGecko: getCoinPricesCoinGecko, getAllPrices: getAllPrices, formatPricesByCoin: formatPricesByCoin };
function getAllPrices() {
    return __awaiter(this, void 0, void 0, function () {
        var coinGeckoData, cmcData, prices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getCoinPricesCoinGecko()];
                case 1:
                    coinGeckoData = _a.sent();
                    return [4, getCoinPricesCMC()];
                case 2:
                    cmcData = _a.sent();
                    prices = {
                        coinGecko: coinGeckoData,
                        cmc: cmcData,
                    };
                    return [2, prices];
            }
        });
    });
}
function getCoinPricesCoinGecko() {
    return __awaiter(this, void 0, void 0, function () {
        var coinNames, formattedNames, url, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coinNames = constants.supportedCoinNames;
                    formattedNames = getFormattedNamesAsString(coinNames);
                    url = "https://api.coingecko.com/api/v3/simple/price?ids=".concat(formattedNames, "&vs_currencies=usd");
                    return [4, axios.get(url)];
                case 1:
                    query = _a.sent();
                    return [2, query.data];
            }
        });
    });
}
function getCoinPricesCMC() {
    return __awaiter(this, void 0, void 0, function () {
        var slugs, formattedSlugs, query, array, coinsArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    slugs = constants.supportedCoinSlugs;
                    formattedSlugs = getFormattedNamesAsString(slugs);
                    return [4, axios.get("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=".concat(formattedSlugs), {
                            headers: {
                                'X-CMC_PRO_API_KEY': process.env.PRO_API_KEY
                            },
                        })];
                case 1:
                    query = _a.sent();
                    array = Object.keys(query.data.data);
                    coinsArray = [];
                    array.forEach(function (item) {
                        var name = query.data.data[item].name;
                        var price = query.data.data[item].quote.USD.price;
                        var coin = {};
                        coin[name] = price;
                        coinsArray.push(coin);
                    });
                    return [2, coinsArray];
            }
        });
    });
}
function getCoinPricesGate() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var pairs, prices, _d, pairs_1, pairs_1_1, pair, url_1, res, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    pairs = constants.supportedCoinPairs;
                    prices = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 7, 8, 13]);
                    _d = true, pairs_1 = __asyncValues(pairs);
                    _e.label = 2;
                case 2: return [4, pairs_1.next()];
                case 3:
                    if (!(pairs_1_1 = _e.sent(), _a = pairs_1_1.done, !_a)) return [3, 6];
                    _c = pairs_1_1.value;
                    _d = false;
                    pair = _c;
                    url_1 = "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=".concat(pair);
                    return [4, axios.get(url_1)];
                case 4:
                    res = _e.sent();
                    prices.push({
                        name: res.data[0].currency_pair,
                        price: res.data[0].last
                    });
                    _e.label = 5;
                case 5:
                    _d = true;
                    return [3, 2];
                case 6: return [3, 13];
                case 7:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 13];
                case 8:
                    _e.trys.push([8, , 11, 12]);
                    if (!(!_d && !_a && (_b = pairs_1.return))) return [3, 10];
                    return [4, _b.call(pairs_1)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10: return [3, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7];
                case 12: return [7];
                case 13:
                    ;
                    return [2, prices];
            }
        });
    });
}
function getCoinPricesLCW() {
    return __awaiter(this, void 0, void 0, function () {
        var symbols, requestData, config, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    symbols = constants.supportedCoinSymbols;
                    requestData = {
                        codes: symbols,
                        currency: "USD",
                        sort: "rank",
                        order: "ascending",
                        offset: 0,
                        limit: 0,
                        meta: false,
                    };
                    config = {
                        method: 'post',
                        url: 'https://api.livecoinwatch.com/coins/map',
                        headers: {
                            'content-type': 'application/json',
                            'x-api-key': liveCoinWatchKey,
                        },
                        data: JSON.stringify(requestData),
                    };
                    return [4, axios(config)];
                case 1:
                    res = _a.sent();
                    return [2, res.data];
            }
        });
    });
}
function formatPricesByCoin() {
    return __awaiter(this, void 0, void 0, function () {
        var coins, allPrices, coinGecko, name_1, symbol, coin, cmc, _i, cmc_1, name_2, price, symbol, coin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coins = constants.coins;
                    return [4, getAllPrices()];
                case 1:
                    allPrices = _a.sent();
                    coinGecko = allPrices["coinGecko"];
                    for (name_1 in coinGecko) {
                        symbol = matchCoinToCoins("coinGecko", name_1.toString());
                        for (coin in coins) {
                            if (coin.toString() == symbol) {
                                coins[coin].push({ coinGecko: coinGecko[name_1].usd });
                            }
                        }
                    }
                    cmc = allPrices["cmc"];
                    for (_i = 0, cmc_1 = cmc; _i < cmc_1.length; _i++) {
                        name_2 = cmc_1[_i];
                        price = Object.values(name_2)[0];
                        name_2 = Object.keys(name_2)[0];
                        symbol = matchCoinToCoins("cmc", name_2.toString());
                        for (coin in coins) {
                            if (coin.toString() == symbol) {
                                coins[coin].push({ cmc: price });
                            }
                        }
                    }
                    return [2, coins];
            }
        });
    });
}
function matchCoinToCoins(source, coin) {
    var coinName;
    switch (source) {
        default: {
            coinName = "Not Supported";
        }
        case "coinGecko": {
            switch (coin) {
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
            switch (coin) {
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
                case "USD Coin": {
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
    }
    return coinName;
}
function getFormattedNamesAsString(coinNames) {
    var bigString = "";
    var length = coinNames.length;
    coinNames.forEach(function (name, i) {
        if (i == length - 1) {
            bigString += "".concat(name);
        }
        else {
            bigString += "".concat(name, ",");
        }
    });
    return bigString;
}
//# sourceMappingURL=getCoinInfo.js.map