const Discord = require('discord.js');

export const accountEmbed = (
  totalAccountValue,
  totalPositionSize,
  collateral,
  freeCollateral
) =>
  new Discord.MessageEmbed()
    .setTitle('Account')
    .setColor(0x00ae86)
    .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
    .addFields({
      name: 'Total Account Value',
      value: `$${totalAccountValue}`,
      inline: true,
    })
    .addFields({
      name: 'Total Position Size',
      value: `$${totalPositionSize}`,
      inline: true,
    })
    .addFields({
      name: '\u200b',
      value: '\u200b',
      inline: false,
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
    })
    .setTimestamp();

export const openPositionsEmbed = (str) =>
  new Discord.MessageEmbed()
    .setTitle('Open Positions')
    .setColor(0x00ae86)
    .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
    .addFields({
      name: 'Position',
      value: `${str}`,
    })

    .setTimestamp();


// change this - formatting is really weird if theres a ton of orders (RUNE for ex)
export const openOrdersEmbed = (str) =>
  new Discord.MessageEmbed()
    .setTitle('Open Positions')
    .setColor(0x00ae86)
    .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
    .addFields({
      name: 'Position',
      value: `${str}`,
    })

    .setTimestamp();
