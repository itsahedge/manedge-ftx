"use strict";
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
        while (_) try {
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
exports.__esModule = true;
// const Discord = require('discord.js');
var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();
var config_1 = require("./config");
var formatter_1 = require("./helpers/formatter");
var commandHandler_1 = require("./helpers/commandHandler");
var startBot = function () {
    var TOKEN = process.env.TOKEN;
    client.login(TOKEN);
    client.on('ready', function () {
        var emojiTest = client.emojis.cache.find(function (e) { return e.name === 'long'; });
        console.info("Logged in as " + client.user.tag + "!");
        start(client);
    });
    client.on('rateLimit', function (info) {
        console.log("Rate limit hit " + (info.timeDifference
            ? info.timeDifference
            : info.timeout
                ? info.timeout
                : 'Unknown timeout '));
    });
};
startBot();
var start = function (client) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        client.on('message', function (msg) {
            // move these into separate
            // const emoji = client.emojis.cache.get('838247076201627655');
            // const emojiTest = client.emojis.cache.get('838247076201627655');
            // let emojiTest = client.emojis.cache.find((e) => e.name === 'long');
            // let longEmoji = msg.guild.emojis.cache.find(
            //   (emoji) => emoji.name === 'long'
            // );
            // has to be from the same server
            var longEmoji = '<:long:838247076201627655>';
            var shortEmoji = '<:short:873659191141732372>';
            // let shortEmoji = msg.guild.emojis.cache.find(
            //   (emoji) => emoji.name === 'short'
            // );
            // =====================================================
            // ACCOUNT DETAILS
            // .account
            // =====================================================
            if (msg.content === '.account') {
                commandHandler_1.fetchAccount(msg);
            }
            // =====================================================
            // GET ALL OPEN POSITIONS
            // .positions
            // =====================================================
            if (msg.content === '.positions') {
                // const fetchPositions = async () => {
                //   const positionsData = await getOpenPositions(ftx);
                //   let str = '';
                //   positionsData.map((p: { ticker: string; side: string; costUsd: any; netSize: any; recentAverageOpenPrice: any; recentBreakEvenPrice: any; entryPrice: any; recentPnl: any; }) => {
                //     const splitAsset = p.ticker.split('-');
                //     const asset = splitAsset[0];
                //     if (p.side === "LONG") {
                //       const formattedCost = formatter.format(p.costUsd)
                //       str += `**${longEmoji} ${p.ticker}**\n**Net Size**: ${p.netSize} ${asset}\n**Cost**: ${formattedCost}\n**Avg Entry**: ${p.recentAverageOpenPrice} | **B/E**: ${p.recentBreakEvenPrice}\n**Mark**: ${p.entryPrice}\n**uPnL**: ${p.recentPnl}\n\n`;
                //     } else {
                //       const formattedCost = formatter.format(p.costUsd)
                //       str += `**${shortEmoji} ${p.ticker}**\n**Net Size**: ${p.netSize} ${asset}\n**Cost**: ${formattedCost}\n**Avg Entry**: ${p.recentAverageOpenPrice} | **B/E**: ${p.recentBreakEvenPrice}\n**Mark**: ${p.entryPrice}\n**uPnL**: ${p.recentPnl}\n\n`;
                //     }
                //   });
                //   if (str) {
                //     msg.channel.send(str);
                //   } else {
                //     msg.channel.send("No open positions");
                //   }
                // };
                // importing this function does not work for some reason
                // const formatOpenPositions = (data: OpenPosition[]): string => {
                //   const { future } = data[0];
                //   return future;
                // };
                var fetchPositions = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var data, str, positions;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, config_1.ftxClient.getPositions(true)];
                            case 1:
                                data = _a.sent();
                                str = '';
                                positions = formatter_1.formatOpenPositions(data.result);
                                positions.map(function (x) {
                                    str += "**" + (x.side === 'LONG' ? longEmoji : shortEmoji) + " " + x.ticker + "**\n**Net Size**: " + x.netSize + " " + x.asset + "\n**Mark**: " + x.entryPrice + "\n**Cost**: " + x.cost + "\n**Avg Entry**: " + x.avgOpenPrice + " | **B/E**: " + x.breakEvenPrice + "\n**uPnL**: " + x.unrealizedPnl + "\n\n";
                                });
                                console.log(positions);
                                if (str) {
                                    msg.channel.send(str);
                                }
                                else {
                                    msg.channel.send('No open positions');
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                fetchPositions();
            }
            // =====================================================
            // BALANCES
            // .account
            // =====================================================
            // if (msg.content === '.balances') {
            //   const fetchBalances = async () => {
            //     try {
            //       const balancesData = await getBalances(ftx);
            //       const { main } = balancesData; // main is main account
            //       let str = '';
            //       _.forEach(main, (balance) => {
            //         const { coin, free, total, usdValue } = balance;
            //         if (usdValue >= 1) {
            //           const formattedUsdVal = formatter.format(usdValue);
            //           str += `**[${coin}]** **Free**: ${free} | **Total**: ${total}\n**USD Value**: ${formattedUsdVal}\n\n`;
            //         }
            //       });
            //       if (str) {
            //         msg.channel.send(str);
            //       } else {
            //         msg.channel.send("No balance || Error");
            //       }
            //     } catch (error) {
            //       console.log("API Error", error)
            //     }
            //   };
            //   fetchBalances();
            // };
            // =====================================================
            // DEPOSITS
            // .deposit usdt erc20
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.deposit')){
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 3);
            //   const coin = parsed[1].toUpperCase();
            //   let network = "";
            //   if (typeof parsed[2] !== 'undefined') {
            //     network = parsed[2].toLowerCase();
            //   }
            //   const fetchDepositAddress = async () => {
            //     try {
            //       const depositAddress = await getDeposit(ftx, coin, network);
            //       const { address } = depositAddress;
            //       let str = '';
            //       str += `**[${coin}] Deposit Address**\n**${address}** \n\n`;
            //       if (str) {
            //         msg.channel.send(str);
            //       } else {
            //         msg.channel.send("No balance || Error");
            //       }
            //     } catch (error) {
            //       console.log("API Error", error)
            //       msg.channel.send(`API Error:\n${error}`);
            //     }
            //   };
            //   fetchDepositAddress();
            // };
            // =====================================================
            // WITHDRAWALS: coin, size, address, code (2fa)
            // .withdraw eth 0.01 ADDRESS 123456
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.withdraw')){
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 5);
            //   const ticker = parsed[1].toUpperCase(); // ETH
            //   const amount = parsed[2]; // 0.01
            //   const withdrawalAddress = parsed[3];
            //   const code2fa = parsed[4];
            //   const requestWithdrawal = async () => {
            //     try {
            //       const withdrawalData = await getWithdrawal(ftx, ticker, amount, withdrawalAddress, code2fa);
            //       const { coin, address, size, status } = withdrawalData;
            //       let str = '';
            //       str += `**Withdrawal Request for ${size} ${coin}**\n**Withdrawal Address**: ${address}\n**Status**: ${status}\n\n`;
            //       if (str) {
            //         msg.channel.send(str);
            //       } else {
            //         msg.channel.send("Something went wrong with the Withdrawal Request");
            //       }
            //     } catch (error) {
            //       console.log("API Error", error)
            //       msg.channel.send(`API Error:\n${error}`);
            //     }
            //   };
            //   requestWithdrawal();
            // };
            // =====================================================
            // GET TRIGGER ORDERS (TP/STOP)
            // .get-trigger btc-perp
            // =====================================================
            // if (msg.content.startsWith('.trigger')) {
            //   const inputStr = msg.content.toUpperCase();
            //   const inputArr = inputStr.split(' ')
            //   const ticker = inputArr[1]
            //   const fetchTriggerOrders = async (ticker) => {
            //     try {
            //       const openTriggersData = await getTriggerOrders(ftx, ticker);
            //       let str = '';
            //       openTriggersData.map((p) => {
            //         str += `**${p.market}**\n**Status**: ${p.status}\n**OrderType**: ${p.orderType}\n**Type**: ${p.type}\n**Size**: ${p.size}\n**TriggerPrice** : ${p.triggerPrice}\n**Estimated Return**: ${p.estimatedReturn}\n**Id: **${p.id} \n\n`;
            //       });
            //       if (str) {
            //         msg.channel.send(str);
            //       } else {
            //         msg.channel.send(`No Trigger Orders for ${ticker}`)
            //       }
            //     } catch (error) {
            //       console.log('API Error', error)
            //     }
            //   }
            //   fetchTriggerOrders(ticker)
            // };
            // =====================================================
            // GET OPEN ORDERS
            // .orders btc-perp
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.orders')) {
            //   const inputStr = msg.content.toUpperCase();
            //   const parsed = _.split(inputStr, ' ', 2); // parsed Array
            //   const ticker = parsed[1]; // rune-perp
            //   const fetchOpenOrders = async (ticker) => {
            //     try {
            //       const openOrdersData = await getOpenOrders(ftx, ticker);
            //       let str = '';
            //       let id = ''
            //       openOrdersData.map((p) => {
            //         str += `**Pair: **${p.market}\n**${p.type}** (${p.status})\n**Side: **${p.side}\n**Price: **$${p.price}\n**Size: **${p.size} ${p.market} | remaining: ${p.remainingSize} \n\n`;
            //         id += `${p.id}`
            //       });
            //       if (str) {
            //         msg.channel.send(id);
            //         msg.channel.send(str);
            //       } else {
            //         msg.channel.send(`No Open Orders for ${ticker}`)
            //       }
            //     } catch (error) {
            //       console.log('API Error', error)
            //     }
            //   };
            //   fetchOpenOrders(ticker);
            // }
            // =====================================================
            // PLACE MARKET ORDERS
            // .market buy snx-perp 10
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.market')) {
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 5); // parsed Array
            //   const sides = parsed[1]; // buy or sell
            //   const pair = parsed[2]; // rune-perp
            //   const size = parsed[3]; // 1 RUNE
            //   const newSize = parseFloat(size);
            //   const placeMarketOrder = async () => {
            //     try {
            //       const resp = await ftx.request({
            //         method: 'POST',
            //         path: '/orders',
            //         data: {
            //           market: pair,
            //           side: sides,
            //           price: null, //send null for market orders
            //           type: 'market',
            //           size: newSize,
            //         },
            //       });
            //       const { result } = resp;
            //       console.log(result);
            //       const { market, side, size, type } = result;
            //       // return result;
            //       msg.channel.send(`${type}: ${side.toUpperCase()} ${market} ${size} `)
            //     } catch (error) {
            //       console.error(error)
            //       msg.channel.send("format not correct")
            //     }
            //   };
            //   placeMarketOrder();
            // }
            // =====================================================
            // PLACE LIMIT ORDERS
            // .limit sell RUNE-PERP 1 3
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.limit')) {
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 5); // parsed Array
            //   const side = parsed[1]; // buy or sell
            //   const pair = parsed[2]; // rune-perp
            //   const size = parsed[3]; // 1 RUNE
            //   const price = parsed[4] // price (if not provided to null for market?)
            //   const newSize = parseFloat(size);
            //   const newPrice = parseFloat(price);
            //   if (parsed.length < 5) {
            //     msg.channel.send('Incorrect command format.');
            //     return null
            //   } else {
            //     const data = {
            //       market: pair,
            //       side: side, // buy or sell
            //       price: newPrice, // formatted
            //       type: 'limit',
            //       size: newSize, // foramtted
            //     };
            //     const placeLimitOrder = async () => {
            //       try {
            //         const resp = await ftx.request({
            //           method: 'POST',
            //           path: '/orders',
            //           data: data,
            //         });
            //         const { result } = resp;
            //         if (result) {
            //           console.log(result)
            //           msg.channel.send('Placed limit order');
            //         } else {
            //           msg.channel.send(`Something went wrong.`)
            //         }
            //       } catch (error) {
            //         console.log(error)
            //       }
            //     };
            //     placeLimitOrder();
            //   }
            // }
            // =====================================================
            // PLACE TRIGGER ORDERS (STOPS)
            // .sl sell RUNE-PERP 1 0.43
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.sl')) {
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 5); // parsed Array
            //   const side = parsed[1];
            //   const pair = parsed[2];
            //   const size = parsed[3];
            //   const triggerPrice = parsed[4] // price (if not provided to null for market?)
            //   const newSize = parseFloat(size);
            //   const trigger = parseFloat(triggerPrice);
            //   if (parsed.length < 5) {
            //     msg.channel.send('Incorrect command format.');
            //     return null
            //   } else {
            //     const data = {
            //       market: pair,
            //       side: side, // buy or sell
            //       triggerPrice: trigger, // formatted
            //       type: 'stop', // stop, trailingStop or takeProfit; default is stop
            //       size: newSize, // foramtted
            //     };
            //     const placeTriggerOrder = async () => {
            //       try {
            //         const resp = await ftx.request({
            //           method: 'POST',
            //           path: '/conditional_orders',
            //           data: data,
            //         });
            //         const { result } = resp;
            //         if (result) {
            //           msg.channel.send('Placed stop market trigger order');
            //         }
            //       } catch (error) {
            //         console.log(error)
            //         msg.channel.send(`Error was caught. Check logs.`)
            //       }
            //     };
            //     placeTriggerOrder();
            //   }
            // }
            // =====================================================
            // CANCEL ALL ORDERS (TRIGGERS AND LIMITS)
            // .del-all rune-perp
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.del-all')) {
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 2); // parsed Array
            //   const ticker = parsed[1];
            //   console.log(ticker)
            //   const cancelOrders = async (ticker: string) => {
            //     try {
            //       const orders = await cancelAllOrders(ftx, ticker);
            //       console.log(orders)
            //       if (orders) {
            //         msg.channel.send(`Cancelled all Open Orders for ${ticker}`);
            //       } else {
            //         msg.channel.send(`No Trigger Orders for ${ticker}`)
            //       }
            //     } catch (error) {
            //       console.log('API Error', error)
            //     }
            //   }
            //   cancelOrders(ticker)
            // }
            // =====================================================
            // CANCEL ORDER BY ID
            // .cancel 21589500506
            // =====================================================
            // if (msg.content.toLowerCase().startsWith('.cancel')) {
            //   const inputStr = msg.content;
            //   const parsed = _.split(inputStr, ' ', 2); // parsed Array
            //   const id = parsed[1];
            //   const cancelOrder = async (id) => {
            //     try {
            //       const orders = await cancelOrderById(ftx, id);
            //       console.log(orders)
            //       if (orders) {
            //         msg.channel.send(`${orders.message}`);
            //       } else {
            //         msg.channel.send(`No Trigger Orders for ${ticker}`)
            //       }
            //     } catch (error) {
            //       console.log('API Error', error)
            //     }
            //   }
            //   cancelOrder(id)
            // }
        });
        return [2 /*return*/];
    });
}); };
