import _ from 'lodash';
const Discord = require('discord.js');

import { ftx } from "./constants"
require('dotenv').config();

import {
  getAccountDetail,
  getOpenPositions,
  getOpenOrders,
  getTriggerOrders,
} from './api/ftxApi';

const client = new Discord.Client();
const TOKEN = process.env.TOKEN;
client.login(TOKEN);
client.on('ready', () => {
  setBot();
});
client.on('rateLimit', (info) => {
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


//TODO:
// market-buy X amount for ABC market
// market-sell X amount for ABC market
// market-sell to close current open position in full and half size

const setBot = async () => {
  console.info(`Logged in as ${client.user.tag}!`);
  client.on('message', (msg) => {
    // ACCOUNT DETAILS
    if (msg.content === '.account') {
      const fetchAccount = async () => {
        try {
          const accountData = await getAccountDetail(ftx);
          const {
            totalAccountValue,
            totalPositionSize,
            collateral,
            freeCollateral,
          } = accountData;

          msg.channel.send(`
            **Total Account Value**: ${totalAccountValue}\n**Total Position Size**: ${totalPositionSize}\n**Collateral**: ${collateral}\n**Free Collateral**: ${freeCollateral}\n
          `);
        } catch (error) {
          console.log("API Error", error)
        }
      };

      fetchAccount();
    };

    // OPEN POSITIONS
    if (msg.content === '.positions') {
      const fetchPositions = async () => {
        const positionsData = await getOpenPositions(ftx);
        let str = '';
        positionsData.map((p) => {
          str += `[${p.side}]: ${p.ticker}\nNet Size: ${p.netSize}\nCost($): ${p.costUsd}\nAvg Entry: ${p.recentAverageOpenPrice}\nBreak Even: ${p.recentBreakEvenPrice}\nuPnL: ${p.recentPnl}\n \n\n`;
        });

        if (str) {
          msg.channel.send(str);
        } else {
          msg.channel.send("No open positions");
        }
      };

      fetchPositions();
    };

    // TRIGGER ORDERS (TP/STOP)
    if (msg.content.startsWith('.trigger')) {
      const testTicker = msg.content.toUpperCase();
      console.log(testTicker);
      const ticker = testTicker.slice(9);
      console.log(ticker);

      const fetchTriggerOrders = async (ticker) => {
        try {
          const openTriggersData = await getTriggerOrders(ftx, ticker);

          let str = '';
          openTriggersData.map((p) => {
            str += `**Market**: ${p.market}\n**Status**: ${p.status}\n**OrderType**: ${p.orderType}\n**Type**: ${p.type}\n**Size**: ${p.size}\n**TriggerPrice** : ${p.triggerPrice}\n**Estimated Return**: ${p.estimatedReturn} \n\n`;
          });

          if (str) {
            msg.channel.send(str);
          } else {
            msg.channel.send(`No Open Orders for ${ticker}`)
          }
        } catch (error) {
          console.log('API Error', error)
        }
      }

      fetchTriggerOrders(ticker)
    };

    // OPEN ORDERS
    if (msg.content.toLowerCase().startsWith('.open')) {
      const input = msg.content.toUpperCase();
      console.log(input);
      const ticker = input.slice(6); // removes `.open ` 
      console.log(ticker)

      const fetchOpenOrders = async (ticker) => {
        try {
          const openOrdersData = await getOpenOrders(ftx, ticker);

          let str = '';
          openOrdersData.map((p) => {
            str += `${p.market}\n${p.type}\n${p.status}\n${p.price}\n${p.size}\n${p.remainingSize} \n\n`;
          });

          if (str) {
            msg.channel.send(str);
          } else {
            msg.channel.send(`No Open Orders for ${ticker}`)
          }
        } catch (error) {
          console.log('API Error', error)
        }
      };
      fetchOpenOrders(ticker);
    }
    // CASES:
    // Market close specified amount of size only
    // Market close full position
    // Market close half position
    if (msg.content.toLowerCase().startsWith('.order-market')) {
      // .close RUNE-PERP side price market size

      // if order is MARKET, then price should be null
      const inputStr = msg.content;
      const parsedInput = /^\.order (?<market>.*) (?<size>\d+) (?<type>.*) (?<side>.*)/.exec(
        inputStr
      ).groups;

      // what to do with orderObject?
      const { market, size, type, side } = parsedInput;

      const fetchPlaceOrders = async () => {
        const resp = await ftx.request({
          method: 'POST',
          path: '/orders',
          data: {
            market: market,
            side: side,
            price: null, //send null for market orders
            type: type,
            size: size,
          },
        });
        const { result } = resp;
        console.log(result);
        return result;
      };
      fetchPlaceOrders();
    }
    if (msg.content.toLowerCase().startsWith('.test')) {
      // .close RUNE-PERP side price market size

      // if order is MARKET, then price should be null
      // const inputStr = msg.content;
      // const parsedInput = /^\.order-limit (?<market>.*) (?<side>.*) (?<size>\d+) (?<price>\d+) /.exec(
      //   inputStr
      // ).groups;

      // const inputStr2 = '.order RUNE-PERP buy 24 0.1';
      const inputStr = msg.content;
      // found issue: price is not being parsed correctly.
      const parsedInput = /^\.test (?<market>.*) (?<side>.*) (?<size>[0-9.]+) (?<price>[0-9.]+)/.exec(
        inputStr
      ).groups;

      // take the string, split it

      // .order RUNE-PERP buy 24 0.1
      const { market, side, size, price } = parsedInput;
      const newSize = parseFloat(size);
      const newPrice = parseFloat(price);

      const data = {
        market: market,
        side: side,
        price: newPrice, //price not able to pick up newPrice??
        type: 'limit',
        size: newSize,
      };

      const fetchPlaceOrders = async () => {
        const resp = await ftx.request({
          method: 'POST',
          path: '/orders',
          data: data,
        });
        console.log(data);
        const { result } = resp;
        console.log(result);
        return result;
      };
      fetchPlaceOrders();
    }
  });
};
