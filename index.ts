import * as _ from 'lodash';
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

require('dotenv').config();
import { ftxClient } from './config';

import {
  getBalanceData,
  getDepositAddress,
  getOrdersData,
  placeLimitOrder,
  placeMarketOrder,
} from './apiv2/requests';
import {
  formatter,
  formatOpenPositions,
  formatOrders,
  formatBalances,
} from './helpers/formatter';
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
  client.on('message', async (msg) => {
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
          str += `**${x.side === 'LONG' ? '🟢' : '🔴'} ${
            x.ticker
          }**\n**Net Size**: ${x.netSize} ${x.asset}\n**Cost**: ${
            x.cost
          }\n**Mark**: ${x.entryPrice}\n**Avg Entry**: ${
            x.avgOpenPrice
          } | **B/E**: ${x.breakEvenPrice}\n**Liq**: ${
            x.estimatedLiquidationPrice
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
    // CANCEL ORDER BY ID or ALL ORDERS FOR A TICKER
    // .cancel (orderId or ticker)
    // TODO: cancel ALL
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.cancel')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 2); // parsed Array

      if (parsed.length < 2) {
        msg.channel.send('Incorrect command format.');
        return null;
      } else {
        const orderId = parsed[1].toUpperCase();
        const cancelOrder = async (id: any) => {
          try {
            // check for id is a ticker or valid number
            const orderToCancel = isNaN(id)
              ? await ftxClient.cancelAllOrders({ market: id })
              : await ftxClient.cancelOrder(id);

            if (orderToCancel) {
              msg.channel.send(
                isNaN(id)
                  ? `⌀ Cancelling all orders for ${id}`
                  : `⌀ Order queued for cancellation: (ID ${id})`
              );
            } else {
              msg.channel.send(`Incorrect cancel command`);
            }
          } catch (error) {
            console.log('API Error', error);
          }
        };
        cancelOrder(orderId);
      }
    }

    // =====================================================
    // BALANCES
    // .balances
    // =====================================================
    if (msg.content === '.balances') {
      const fetchBalances = async () => {
        try {
          const balancesData = await getBalanceData();
          const formatted = formatBalances(balancesData);
          let str = '';

          _.forEach(formatted, (x) => {
            if (x.usdValue >= 1) {
              const formattedUsdVal = formatter.format(x.usdValue);
              str += `**[${x.coin}]** **Free**: ${x.free} | **Total**: ${x.total}\n**USD Value**: ${formattedUsdVal}\n\n`;
            }
          });

          if (str) {
            msg.channel.send(str);
          } else {
            msg.channel.send('No balance || Error');
          }
        } catch (error) {
          console.log('API Error', error);
        }
      };

      fetchBalances();
    }

    // =====================================================
    // DEPOSITS
    // .deposit usdt erc20
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.deposit')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 3);

      if (parsed.length < 2) {
        msg.channel.send('Incorrect command format.');
        return null;
      } else {
        const coin = parsed[1].toUpperCase();
        const fetchDepositAddress = async () => {
          try {
            const data = {
              coin: coin,
              method: parsed[2] ? parsed[2] : '',
            };

            const response = await getDepositAddress(data);
            const { address, method } = response;

            let str = '';
            str += `**[${coin}] (${method.toUpperCase()} Network)\nDeposit Address**: ${address}`;

            if (str) {
              msg.channel.send(str);
            } else {
              msg.channel.send('No balance || Error');
            }
          } catch (error) {
            console.log('API Error', error);
            msg.channel.send(`API Error:\n${error.body.error}`);
          }
        };
        fetchDepositAddress();
      }
    }

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
      const inputStr = msg.content.toUpperCase();
      const parsed = _.split(inputStr, ' ', 2); // parsed Array
      const ticker = parsed[1]; // rune-perp
      const fetchOpenOrders = async (ticker) => {
        try {
          const openOrdersData = await getOrdersData(ticker);
          const formatted = formatOrders(openOrdersData);
          let str = '';

          _.forEach(formatted, (o) => {
            str += `✏️ (Order) ${o.market}: ${o.type} ${o.side} @${o.price} (${o.remainingSize} of ${o.size}) (ID ${o.id}) - ${o.status} \n`;
          });

          if (str) {
            msg.channel.send(str);
          } else {
            msg.channel.send(
              ` No open orders ${ticker ? `for ${ticker}` : ''} `
            );
          }
        } catch (error) {
          console.log('API Error', error);
        }
      };
      fetchOpenOrders(ticker);
    }

    // =====================================================
    // PLACE MARKET ORDERS
    // .market buy btc-perp 0.01
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.market')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 5); // parsed Array

      const sideDirection = parsed[1]; // buy or sell
      const ticker = parsed[2]; // btc-perp or` ftt/usd
      const sizeAmount = parseFloat(parsed[3]);

      const marketOrder = async () => {
        try {
          const data = {
            type: 'market',
            market: ticker,
            side: sideDirection,
            price: null, // for market orders
            size: sizeAmount,
          };
          // const response = await ftxClient.placeOrder(data);
          const placeOrder = await placeMarketOrder(data);

          const { id, status, type, market, side, size } = placeOrder;

          msg.channel.send(`${
            side.toUpperCase() === 'SELL' ? '⤵️' : '⤴️'
          } (Order) ${market}: ${type.toUpperCase()} ${side.toUpperCase()} ${size} (ID ${id}) - ${status} 
          `);
        } catch (error) {
          console.error(error);
          msg.channel.send('format not correct');
        }
      };
      marketOrder();
    }

    // =====================================================
    // PLACE LIMIT ORDERS
    // .limit sell RUNE-PERP 1 3
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.limit')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 5); // parsed Array

      const sideDirection = parsed[1]; // buy or sell
      const ticker = parsed[2]; // rune-perp
      const size = parsed[3]; // 1 RUNE
      const price = parsed[4]; // price (if not provided to null for market?)
      const newSize = parseFloat(size);
      const newPrice = parseFloat(price);

      if (parsed.length < 5) {
        msg.channel.send('Incorrect command format.');
        return null;
      } else {
        const data = {
          market: ticker,
          side: sideDirection, // buy or sell
          price: newPrice, // formatted
          type: 'limit',
          size: newSize, // foramtted
        };
        const placeOrder = await placeLimitOrder(data);
        const { id, status, market, side, price, type, size } = placeOrder;
        msg.channel.send(`${
          side.toUpperCase() === 'SELL' ? '⤵️' : '⤴️'
        } (Order) ${market}: ${type.toUpperCase()} ${side.toUpperCase()} ${size} @${price} (ID ${id}) - ${status} 
        `);
      }
    }

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
  });
};
