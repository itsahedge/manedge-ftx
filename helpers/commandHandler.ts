import { getAccountData } from '../apiv2/requests';
import { formatAccount } from '../helpers/formatter';

export const fetchAccount = async (msg: {
  guild?: { emojis: { cache: any[] } };
  content?: string;
  channel: any;
}) => {
  try {
    const data = await getAccountData();
    const formattedData = formatAccount(data);
    const {
      totalAccountValue,
      totalPositionSize,
      collateral,
      freeCollateral,
      totalLeverage,
    } = formattedData;
    msg.channel.send(`
    **💰: ${totalAccountValue}**\n**Total Collateral**: ${collateral}\n**Free Collateral**: ${freeCollateral}\n**Total Position Size**: ${totalPositionSize}\n**Leverage Used: **${totalLeverage}x\n
  `);
  } catch (error) {
    console.log('API Error', error);
  }
};

// export const fetchPositions = async (msg: {
//   guild?: { emojis: { cache: any[] } };
//   content?: string;
//   channel: any;
// }) => {
//   try {
//     const data = await getOpenPositionData();

//     console.log('from fetchPositions: ', data);
//     msg.channel.send(`${data}`);
//   } catch (error) {
//     console.log('API Error', error);
//   }
// };
