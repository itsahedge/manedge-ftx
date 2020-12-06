import _ from 'lodash';
const Discord = require('discord.js');

require('dotenv').config();
import { getAccountDetail } from './ftxApi';
import { accountEmbed } from './botMessages';

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
  console.info(`Logged in as ${client.user.tag}!`); // Logged in as FTX#0760!
  client.on('message', (msg) => {
    if (msg.content === 'test') {
      // console.log(Date.now());
      async function fetchData() {
        let timestamp = Date.now();

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
      }
      fetchData();
    }
  });
};
