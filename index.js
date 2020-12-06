import _ from 'lodash';
const Discord = require('discord.js');

require('dotenv').config();
import { getAccountDetail, getOpenPositions } from './api/ftxApi';
import { accountEmbed, openPositionsEmbed } from './botMessages';

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
  });
};
