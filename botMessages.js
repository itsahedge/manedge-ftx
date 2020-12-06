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
      name: 'Total Collateral',
      value: `$${collateral}`,
      inline: true,
    })
    .addFields({
      name: 'Free Collateral',
      value: `$${freeCollateral}`,
      inline: true,
    });
