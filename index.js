import _ from 'lodash';
require('dotenv').config();
const Discord = require('discord.js');

import { ftx, accountDraft, positionDraft, placeOrderDraft } from './constants';

const discordBot = async () => {
  const ftxData = await fetchFtxData();
  console.log(ftxData);

  const {
    totalAccountValue,
    totalPositionSize,
    collateral,
    freeCollateral,
  } = ftxData.accountBalance;

  const bot = new Discord.Client();

  const TOKEN = process.env.TOKEN;
  bot.login(TOKEN);
  bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`); // Logged in as FTX#0760!
  });
  bot.on('message', (msg) => {
    if (msg.content === '.account') {
      const embed = new Discord.MessageEmbed()
        .setTitle('Account')
        .setColor(0x00ae86)
        .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
        .addFields({
          name: 'Total Account Value',
          value: `$${totalAccountValue}`,
        })
        .addFields({
          name: 'Total Position Size',
          value: `$${totalPositionSize}`,
        })
        .addFields({
          name: 'Total Collateral',
          value: `$${collateral}`,
          inline: true,
        })
        .addFields({
          name: 'Free Collateral',
          value: `$${freeCollateral}`,
          inline: true,
        });
      msg.channel.send(embed);
    }
    if (msg.content === '.placeOrder') {
      const fetchPlacedOrder = async () => {
        const limit = await placeOrder();
        console.log(limit);
        return limit;
      };
      fetchPlacedOrder();
    }
  });
};

const fetchFtxData = async () => {
  const [accountBalance, openPositions] = await Promise.all([
    getAccount(),
    getOpenPositions(),
  ]);
  // const openTriggerOrdersByTicker = _.groupBy(openTriggerOrders, 'ticker');
  const parent = {};

  parent.accountBalance = accountBalance;
  parent.openPositions = openPositions;

  // console.log(parent);

  // const testTicker = parent.openPositions[0].ticker;
  // console.log(testTicker);

  // placeOrder();
  return parent;
};

// ACCOUNT DETAILS
const getAccount = async () => {
  const data = await ftx.requestDraft(accountDraft);
  const {
    result: {
      username,
      totalAccountValue,
      totalPositionSize,
      collateral,
      freeCollateral,
    },
  } = data;

  return {
    username,
    totalAccountValue,
    totalPositionSize,
    collateral,
    freeCollateral,
  };
};

// OPEN POSITIONS
const getOpenPositions = async () => {
  const data = await ftx.requestDraft(positionDraft);
  const { result } = data;

  const openPositions = result.flatMap((o) =>
    o.entryPrice !== null
      ? [
          {
            ticker: o.future,
            side: o.side,
            entryPrice: o.entryPrice, // this actually gives the Mark Price.
            costUsd: o.cost, // equal to size * entry price == costUsd
            netSize: o.netSize,
            unrealizedPnl: o.unrealizedPnl, //PnL (unrealized)
            realizedPnl: o.realizedPnl, //PnL (unrealized)
          },
        ]
      : []
  );

  return openPositions;
};

// GET ALL OPEN ORDERS

// PLACE AN ORDER
const placeOrder = async () => {
  // the values in the data object will need to be dynamic
  // taken from discord user input
  const data = {
    market: 'RUNE-PERP',
    size: 1,
    side: 'buy',
    order_type: 'Limit',
    price: 0.5,
  };

  const placeOrder = placeOrderDraft(data);
  const order = await ftx.requestDraft(placeOrder);

  // console.log(order);

  return order;
};

// fetchFtxData();
discordBot();
