import _ from 'lodash';
const Discord = require('discord.js');

require('dotenv').config();
import { ftx } from './constants';

import {
  getAccountDetail,
  getOpenPositions,
  getOpenOrders,
} from './api/ftxApi';
import {
  accountEmbed,
  openPositionsEmbed,
  openOrdersEmbed,
} from './botMessages';

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
    if (msg.content === '.account') {
      const fetchAccount = async () => {
        const accountData = await getAccountDetail();
        const {
          totalAccountValue,
          totalPositionSize,
          collateral,
          freeCollateral,
        } = accountData;

        const embed = accountEmbed(
          totalAccountValue,
          totalPositionSize,
          collateral,
          freeCollateral
        );

        msg.channel.send(embed);
      };

      fetchAccount();
    }
    if (msg.content === '.positions') {
      const fetchPositions = async () => {
        const positionsData = await getOpenPositions();
        let str = '';
        positionsData.map((p) => {
          str += `${p.ticker} [${p.side}]\nNet Size: ${p.netSize}\nCost($): ${p.costUsd}\nAvg Entry: ${p.recentAverageOpenPrice}\nBreak Even: ${p.recentBreakEvenPrice}\nuPnL: ${p.recentPnl}\n \n\n`;
        });

        const embedPositions = openPositionsEmbed(str);
        msg.channel.send(embedPositions);
      };

      fetchPositions();
    }
    if (msg.content.toLowerCase().startsWith('.open')) {
      const testTicker = msg.content.toUpperCase();
      console.log(testTicker);
      const newTicker = testTicker.slice(6);

      const fetchOpenOrders = async (newTicker) => {
        const openOrdersData = await getOpenOrders(newTicker);

        let str = '';
        openOrdersData.map((p) => {
          str += `ID: ${p.id}\nStatus: ${p.status}\n${p.market}\nType: ${p.type}\nSide: ${p.side}\nPrice: ${p.price}\nSize: ${p.size}\nRemaining Size: ${p.remainingSize}\nFilled Size: ${p.filledSize} \n\n`;
        });
        const embedOpenOrders = openOrdersEmbed(str);
        msg.channel.send(embedOpenOrders);
      };
      fetchOpenOrders(newTicker);
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
