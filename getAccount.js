import { accountEmbed } from './botMessages';
import { ftx, accountDraft, positionDraft, placeOrderDraft } from './constants';

// const fetchFtxData = async () => {
//   const [accountBalance, openPositions] = await Promise.all([
//     getAccount(),
//     getOpenPositions(),
//   ]);
//   // const openTriggerOrdersByTicker = _.groupBy(openTriggerOrders, 'ticker');
//   const parent = {};

//   parent.accountBalance = accountBalance;
//   parent.openPositions = openPositions;

//   // console.log(parent);

//   // const testTicker = parent.openPositions[0].ticker;
//   // console.log(testTicker);

//   // placeOrder();
//   return parent;
// };

// ACCOUNT DETAILS
export const getAccount = async () => {
  // const data = await ftx.requestDraft(accountDraft);
  const data = await ftx.request({ method: 'GET', path: '/account'})
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
export const getOpenPositions = async () => {
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
            breakEven: o.recentBreakEvenPrice,
          },
        ]
      : []
  );

  return openPositions;
};
