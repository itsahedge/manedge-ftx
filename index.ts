import * as _ from 'lodash';
// const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

require('dotenv').config();
import { ftxClient } from './config';

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
// import { getOpenPositionData } from './apiv2/requests';
import { Account, OpenPosition } from './apiv2/v2.types';
import { formatOpenPositions } from './helpers/formatter';
import { fetchAccount } from './helpers/commandHandler';

const startBot = () => {
  const TOKEN = process.env.TOKEN;

  client.login(TOKEN);
  client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
    start(client);
  });

  client.on('rateLimit', (info: { timeDifference: any; timeout: any }) => {
    console.log(
      `Rate limit hit ${
        info.timeDifference
          ? info.timeDifference
          : info.timeout
          ? info.timeout
          : 'Unknown timeout '
      }`
    );
  });
};
startBot();

const start = async (client) => {
  client.on('message', (msg) => {
    const longEmoji = '<:long:838247076201627655>';
    const shortEmoji = '<:short:873659191141732372>';

    // =====================================================
    // ACCOUNT DETAILS
    // .account
    // =====================================================
    if (msg.content === '.account') {
      fetchAccount(msg);
    }

    // =====================================================
    // GET ALL OPEN POSITIONS
    // .positions
    // =====================================================
    if (msg.content === '.positions') {
      const fetchPositions = async () => {
        const data = await ftxClient.getPositions(true);
        let str = '';
        const positions = formatOpenPositions(data.result);

        positions.map((x) => {
          str += `**${x.side === 'LONG' ? longEmoji : shortEmoji} ${
            x.ticker
          }**\n**Net Size**: ${x.netSize} ${x.asset}\n**Mark**: ${
            x.entryPrice
          }\n**Cost**: ${x.cost}\n**Avg Entry**: ${x.avgOpenPrice} | **B/E**: ${
            x.breakEvenPrice
          }\n**uPnL**: ${x.unrealizedPnl}\n\n`;
        });

        if (str) {
          msg.channel.send(str);
        } else {
          msg.channel.send('No open positions');
        }
      };
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
};
