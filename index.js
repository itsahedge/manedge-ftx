import _ from 'lodash';
const Discord = require('discord.js');

import { ftx } from "./constants"
require('dotenv').config();

import {
  getAccountDetail,
  getOpenPositions,
  getOpenOrders,
  getTriggerOrders,
  cancelAllOrders,
  placeTriggerOrders,
  cancelOrderById
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
// Market close specified amount of size only
// Market close full position
// Market close half position

const setBot = async () => {
  console.info(`Logged in as ${client.user.tag}!`);

  client.on('message', (msg) => {
    let longEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'long');
    let shortEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'short');

    // ===================================================== 
    // ACCOUNT DETAILS
    // .account 
    // ===================================================== 
    if (msg.content === '.account') {
      const fetchAccount = async () => {
        try {
          const accountData = await getAccountDetail(ftx);
          const {
            totalAccountValue,
            totalPositionSize,
            collateral,
            freeCollateral,
            leverage
          } = accountData;
          
          const formattedTotalAccountValue = Number(totalAccountValue).toFixed(2)
          const formattedTotalCollateral = Number(collateral).toFixed(2)
          const formattedFreeCollateral = Number(freeCollateral).toFixed(2)

          // total position size / collateral = current leverge used
          const totalLeverage = Number(totalPositionSize/formattedTotalCollateral).toFixed(2);
          msg.channel.send(`
            **💰: $${formattedTotalAccountValue}**\n**Total Collateral**: ${formattedTotalCollateral}\n**Total Position Size**: ${totalPositionSize}\n**Free Collateral**: ${formattedFreeCollateral}\n**Leverage Used: **${totalLeverage}x\n
          `);
        } catch (error) {
          console.log("API Error", error)
        }
      };

      fetchAccount();
    };

    // ===================================================== 
    // GET ALL OPEN POSITIONS
    // .positions 
    // ===================================================== 
    if (msg.content === '.positions') {
      const fetchPositions = async () => {
        const positionsData = await getOpenPositions(ftx);
        let str = '';
        positionsData.map((p) => {
          const splitAsset = p.ticker.split('-');
          const asset = splitAsset[0];

          if (p.side === "LONG") {  
            str += `**${longEmoji} ${p.ticker}**\n**Net Size**: ${p.netSize} ${asset}\n**Cost**: $${p.costUsd}\n**Avg Entry**: ${p.recentAverageOpenPrice} | **Break Even**: ${p.recentBreakEvenPrice}\n**Mark**: ${p.entryPrice}\n**uPnL**: ${p.recentPnl}\n\n`;
          } else {
            str += `**${shortEmoji} ${p.ticker}**\n**Net Size**: ${p.netSize} ${asset}\n**Cost**: $${p.costUsd}\n**Avg Entry**: ${p.recentAverageOpenPrice} | **Break Even**: ${p.recentBreakEvenPrice}\n**Mark**: ${p.entryPrice}\n**uPnL**: ${p.recentPnl}\n\n`;
          }
        });

        if (str) {
          msg.channel.send(str);
        } else {
          msg.channel.send("No open positions");
        }
      };
      fetchPositions();
    };

    // ===================================================== 
    // GET TRIGGER ORDERS (TP/STOP)
    // .get-trigger btc-perp
    // ===================================================== 
    if (msg.content.startsWith('.trigger')) { 
      const inputStr = msg.content.toUpperCase();
      const inputArr = inputStr.split(' ')
      const ticker = inputArr[1]
      const fetchTriggerOrders = async (ticker) => {
        try {
          const openTriggersData = await getTriggerOrders(ftx, ticker);

          let str = '';
          openTriggersData.map((p) => {
            str += `**${p.market}**\n**Status**: ${p.status}\n**OrderType**: ${p.orderType}\n**Type**: ${p.type}\n**Size**: ${p.size}\n**TriggerPrice** : ${p.triggerPrice}\n**Estimated Return**: ${p.estimatedReturn}\n**Id: **${p.id} \n\n`;
          });

          if (str) {
            msg.channel.send(str);
          } else {
            msg.channel.send(`No Trigger Orders for ${ticker}`)
          }
        } catch (error) {
          console.log('API Error', error)
        }
      }
      fetchTriggerOrders(ticker)
    };

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
          const openOrdersData = await getOpenOrders(ftx, ticker);

          let str = '';
          let id = ''
          openOrdersData.map((p) => {
            str += `**Pair: **${p.market}\n**${p.type}** (${p.status})\n**Side: **${p.side}\n**Price: **$${p.price}\n**Size: **${p.size} ${p.market} | remaining: ${p.remainingSize} \n\n`;
            id += `${p.id}`
          });

          if (str) {
            msg.channel.send(id);      
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

    // ===================================================== 
    // PLACE MARKET ORDERS
    // .market buy snx-perp 10
    // ===================================================== 
    if (msg.content.toLowerCase().startsWith('.market')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 5); // parsed Array

      const side = parsed[1]; // buy or sell
      const pair = parsed[2]; // rune-perp
      const size = parsed[3]; // 1 RUNE
      const newSize = parseFloat(size);

      console.log(inputStr)
      
      const placeMarketOrder = async () => {
        try {
          const resp = await ftx.request({
            method: 'POST',
            path: '/orders',
            data: {
              market: pair,
              side: side,
              price: null, //send null for market orders
              type: 'market',
              size: newSize,
            },
          });
          const { result } = resp;
          console.log(result);
          // return result;
          msg.channel.send("successfully market order placed")
        } catch (error) {
          console.error(error)
          msg.channel.send("format not correct")
        }
      };
      placeMarketOrder();
    }
    
    // ===================================================== 
    // PLACE LIMIT ORDERS
    // .limit sell RUNE-PERP 1 3
    // ===================================================== 
    if (msg.content.toLowerCase().startsWith('.limit')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 5); // parsed Array

      const side = parsed[1]; // buy or sell
      const pair = parsed[2]; // rune-perp
      const size = parsed[3]; // 1 RUNE
      const price = parsed[4] // price (if not provided to null for market?)
      const newSize = parseFloat(size);
      const newPrice = parseFloat(price);
      
      if (parsed.length < 5) {
        msg.channel.send('Incorrect command format.');
        return null
      } else {
        const data = {
          market: pair,
          side: side, // buy or sell
          price: newPrice, // formatted
          type: 'limit',
          size: newSize, // foramtted
        };
        const placeLimitOrder = async () => { 
          try {
          const resp = await ftx.request({
            method: 'POST',
            path: '/orders',
            data: data,
          });
          const { result } = resp; 
          if (result) {
            msg.channel.send('Placed limit order');
          } else {
            msg.channel.send(`Something went wrong.`)
          }
          } catch (error) {
            console.log(error)
          }
        };
        placeLimitOrder();
      }
    }

    // =====================================================
    // PLACE TRIGGER ORDERS (STOPS)
    // .sl sell RUNE-PERP 1 0.43 
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.sl')) {
      const inputStr = msg.content;
      const parsed = _.split(inputStr, ' ', 5); // parsed Array

      const side = parsed[1]; 
      const pair = parsed[2]; 
      const size = parsed[3]; 
      const triggerPrice = parsed[4] // price (if not provided to null for market?)
      const newSize = parseFloat(size);
      const trigger = parseFloat(triggerPrice);
    
      if (parsed.length < 5) {
        msg.channel.send('Incorrect command format.');
        return null
      } else {
        const data = {
          market: pair,
          side: side, // buy or sell
          triggerPrice: trigger, // formatted
          type: 'stop', // stop, trailingStop or takeProfit; default is stop
          size: newSize, // foramtted
        };
        const placeTriggerOrder = async () => { 
          try {
            const resp = await ftx.request({
              method: 'POST',
              path: '/conditional_orders',
              data: data,
            });
            const { result } = resp; 

            if (result) {
              msg.channel.send('Placed stop market trigger order');
            }
          } catch (error) {
            console.log(error)
            msg.channel.send(`Error was caught. Check logs.`)
          }
        };
        placeTriggerOrder();
      }
    }

    // =====================================================
    // CANCEL ALL ORDERS (TRIGGERS AND LIMITS)
    // .del-all rune-perp
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.del-all')) {
      const inputStr = msg.content;

      const parsed = _.split(inputStr, ' ', 2); // parsed Array
      const ticker = parsed[1];
      console.log(ticker)
    
      const cancelOrders = async (ticker) => {
        try {
          const orders = await cancelAllOrders(ftx, ticker);
          console.log(orders)

          if (orders) {
            msg.channel.send(`Cancelled all Open Orders for ${ticker}`);
          } else {
            msg.channel.send(`No Trigger Orders for ${ticker}`)
          }
        } catch (error) {
          console.log('API Error', error)
        }
      }
      cancelOrders(ticker)
    }

    // =====================================================
    // CANCEL ORDER BY ID 
    // .cancel 21589500506
    // =====================================================
    if (msg.content.toLowerCase().startsWith('.cancel')) {
      const inputStr = msg.content;

      const parsed = _.split(inputStr, ' ', 2); // parsed Array
      const id = parsed[1];
    
      const cancelOrder = async (id) => {
        try {
          const orders = await cancelOrderById(ftx, id);
          console.log(orders)

          if (orders) {
            msg.channel.send(`${orders.message}`);
          } else {
            msg.channel.send(`No Trigger Orders for ${ticker}`)
          }
        } catch (error) {
          console.log('API Error', error)
        }
      }
      cancelOrder(id)
    }
  
  });
};
