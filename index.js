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
var _ = require("lodash");
// const Discord = require('discord.js');
var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();
var config_1 = require("./config");
// import {
//   getAccountDetail,
//   getBalances,
//   getDeposit,
//   getWithdrawal,
//   getOpenPositions,
//   getOpenOrders,
//   getTriggerOrders,
//   cancelAllOrders,
//   placeTriggerOrders,
//   cancelOrderById
// } from './api/ftxApi';
var requests_1 = require("./apiv2/requests");
var formatter_1 = require("./helpers/formatter");
var commandHandler_1 = require("./helpers/commandHandler");
var startBot = function () {
    var TOKEN = process.env.TOKEN;
    client.login(TOKEN);
    client.on('ready', function () {
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
        client.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var longEmoji, shortEmoji, fetchPositions, inputStr, parsed, orderId, cancelOrder, fetchBalances, inputStr, parsed, ticker, fetchOpenOrders, inputStr, parsed, sideDirection_1, pair_1, sizeAmount_1, placeMarketOrder, inputStr, parsed, sideDirection, ticker, size, price, newSize, newPrice, data, placeOrder, id, status_1, market, side, price_1, type, size_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        longEmoji = '<:long:838247076201627655>';
                        shortEmoji = '<:short:873659191141732372>';
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
                            fetchPositions = function () { return __awaiter(void 0, void 0, void 0, function () {
                                var data, str, positions;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, config_1.ftxClient.getPositions(true)];
                                        case 1:
                                            data = _a.sent();
                                            str = '';
                                            positions = formatter_1.formatOpenPositions(data.result);
                                            positions.map(function (x) {
                                                str += "**" + (x.side === 'LONG' ? longEmoji : shortEmoji) + " " + x.ticker + "**\n**Net Size**: " + x.netSize + " " + x.asset + "\n**Cost**: " + x.cost + "\n**Mark**: " + x.entryPrice + "\n**Avg Entry**: " + x.avgOpenPrice + " | **B/E**: " + x.breakEvenPrice + "\n**uPnL**: " + x.unrealizedPnl + "\n\n";
                                            });
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
                        // CANCEL ORDER BY ID or ALL ORDERS FOR A TICKER
                        // .cancel (orderId or ticker)
                        // =====================================================
                        if (msg.content.toLowerCase().startsWith('.cancel')) {
                            inputStr = msg.content;
                            parsed = _.split(inputStr, ' ', 2);
                            // const orderId = parsed[1].toUpperCase();
                            if (parsed.length < 2) {
                                msg.channel.send('Incorrect command format.');
                                return [2 /*return*/, null];
                            }
                            else {
                                orderId = parsed[1].toUpperCase();
                                cancelOrder = function (id) { return __awaiter(void 0, void 0, void 0, function () {
                                    var orderToCancel, _a, error_1;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _b.trys.push([0, 5, , 6]);
                                                if (!isNaN(id)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, config_1.ftxClient.cancelAllOrders({ market: id })];
                                            case 1:
                                                _a = _b.sent();
                                                return [3 /*break*/, 4];
                                            case 2: return [4 /*yield*/, config_1.ftxClient.cancelOrder(id)];
                                            case 3:
                                                _a = _b.sent();
                                                _b.label = 4;
                                            case 4:
                                                orderToCancel = _a;
                                                if (orderToCancel) {
                                                    msg.channel.send(isNaN(id)
                                                        ? "Cancelling all orders for (" + id + ")"
                                                        : "Order queued for cancellation: (" + id + ")");
                                                }
                                                else {
                                                    msg.channel.send("No Trigger Orders for {ticker here}");
                                                }
                                                return [3 /*break*/, 6];
                                            case 5:
                                                error_1 = _b.sent();
                                                console.log('API Error', error_1);
                                                return [3 /*break*/, 6];
                                            case 6: return [2 /*return*/];
                                        }
                                    });
                                }); };
                                cancelOrder(orderId);
                            }
                        }
                        // =====================================================
                        // BALANCES
                        // .balances
                        // =====================================================
                        if (msg.content === '.balances') {
                            fetchBalances = function () { return __awaiter(void 0, void 0, void 0, function () {
                                var balancesData, formatted, str_1, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, requests_1.getBalanceData()];
                                        case 1:
                                            balancesData = _a.sent();
                                            formatted = formatter_1.formatBalances(balancesData);
                                            str_1 = '';
                                            _.forEach(formatted, function (x) {
                                                if (x.usdValue >= 1) {
                                                    var formattedUsdVal = formatter_1.formatter.format(x.usdValue);
                                                    str_1 += "**[" + x.coin + "]** **Free**: " + x.free + " | **Total**: " + x.total + "\n**USD Value**: " + formattedUsdVal + "\n\n";
                                                }
                                            });
                                            if (str_1) {
                                                msg.channel.send(str_1);
                                            }
                                            else {
                                                msg.channel.send('No balance || Error');
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_2 = _a.sent();
                                            console.log('API Error', error_2);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            fetchBalances();
                        }
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
                        if (msg.content.toLowerCase().startsWith('.orders')) {
                            inputStr = msg.content.toUpperCase();
                            parsed = _.split(inputStr, ' ', 2);
                            ticker = parsed[1];
                            fetchOpenOrders = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
                                var openOrdersData, formatted, str_2, error_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, requests_1.getOrdersData(ticker)];
                                        case 1:
                                            openOrdersData = _a.sent();
                                            formatted = formatter_1.formatOrders(openOrdersData);
                                            console.log(formatted);
                                            str_2 = '';
                                            _.forEach(formatted, function (o) {
                                                str_2 += "\u270F\uFE0F (Order) " + o.market + ": " + o.type + " " + o.side + " @" + o.price + " (" + o.remainingSize + " of " + o.size + ") (ID " + o.id + ") - " + o.status + " \n";
                                            });
                                            if (str_2) {
                                                msg.channel.send(str_2);
                                            }
                                            else {
                                                msg.channel.send("No open orders for " + ticker);
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_3 = _a.sent();
                                            console.log('API Error', error_3);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            fetchOpenOrders(ticker);
                        }
                        // =====================================================
                        // PLACE MARKET ORDERS
                        // .market buy btc-perp 0.01
                        // =====================================================
                        if (msg.content.toLowerCase().startsWith('.market')) {
                            inputStr = msg.content;
                            parsed = _.split(inputStr, ' ', 5);
                            sideDirection_1 = parsed[1];
                            pair_1 = parsed[2];
                            sizeAmount_1 = parseFloat(parsed[3]);
                            placeMarketOrder = function () { return __awaiter(void 0, void 0, void 0, function () {
                                var response, _a, market, side, size, type, error_4;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, config_1.ftxClient.placeOrder({
                                                    market: pair_1,
                                                    side: sideDirection_1,
                                                    price: null,
                                                    size: sizeAmount_1
                                                })];
                                        case 1:
                                            response = _b.sent();
                                            _a = response.result, market = _a.market, side = _a.side, size = _a.size, type = _a.type;
                                            msg.channel.send(type + ": " + side.toUpperCase() + " " + market + " " + size + " ");
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_4 = _b.sent();
                                            console.error(error_4);
                                            msg.channel.send('format not correct');
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            placeMarketOrder();
                        }
                        if (!msg.content.toLowerCase().startsWith('.limit')) return [3 /*break*/, 3];
                        inputStr = msg.content;
                        parsed = _.split(inputStr, ' ', 5);
                        sideDirection = parsed[1];
                        ticker = parsed[2];
                        size = parsed[3];
                        price = parsed[4];
                        newSize = parseFloat(size);
                        newPrice = parseFloat(price);
                        if (!(parsed.length < 5)) return [3 /*break*/, 1];
                        msg.channel.send('Incorrect command format.');
                        return [2 /*return*/, null];
                    case 1:
                        data = {
                            market: ticker,
                            side: sideDirection,
                            price: newPrice,
                            type: 'limit',
                            size: newSize
                        };
                        return [4 /*yield*/, requests_1.placeLimitOrder(data)];
                    case 2:
                        placeOrder = _a.sent();
                        id = placeOrder.id, status_1 = placeOrder.status, market = placeOrder.market, side = placeOrder.side, price_1 = placeOrder.price, type = placeOrder.type, size_1 = placeOrder.size;
                        msg.channel.send((side.toUpperCase() === 'SELL' ? '⤵️' : '⤴️') + " (Order) " + market + ": " + type + " " + side + " @" + price_1 + " (" + size_1 + ") (ID " + id + ") - " + status_1 + " \n        ");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
