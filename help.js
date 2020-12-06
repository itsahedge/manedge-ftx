import _ from 'lodash';

import { ftx, accountDraft, positionDraft } from './constants';

const fetchFtxData = async () => {
  const [accountBalance, openPositions, openTriggerOrders] = await Promise.all([
    getAccount(),
    getOpenPositions(),
    getOpenTriggerOrders(),
  ]);
  const openTriggerOrdersByTicker = _.groupBy(openTriggerOrders, 'ticker');
  const parent = {};
  const allPositions = openPositions.map((x) => ({
    ...x,
    openTriggerOrders: openTriggerOrdersByTicker[x.ticker],
  }));

  parent.accountBalance = accountBalance;
  parent.openPositions = allPositions;

  console.log(parent);
  // console.log(parent.openPositions[0]);

  return allPositions;
};

// const fetchFtxData = async () => {
//   const openPositions = await getOpenPositions();
//   const openTriggerOrders = await Promise.allSettled(
//     openPositions.map(({ ticker }) => {
//       const test = ticker;
//       // console.log(test);
//       getOpenTriggerOrders(test);
//     })
//   );
//   // console.log(openTriggerOrders);
//   // FIXME: handle openTriggerOrders failures
//   // const openTriggerOrdersByTicker = _.groupBy(openTriggerOrders, 'ticker');
//   const test = openPositions.map((x) => ({
//     ...x,
//     openTriggerOrders,
//   }));

//   console.log(test[0].openTriggerOrders);

//   console.log('logging the test from fetchFtxData', test);

//   return test;
// };

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

// OPEN TRIGGER ORDERS
// THIS NEEDS TO BE CHANGED TO GET DYNAMIC TICKER
const getOpenTriggerOrders = async () => {
  // console.log('loggin from getOpenTriggerOrders', ticker); //works..

  const openTriggersDraft = ftx.createDraft({
    method: 'GET',
    path: `/conditional_orders?market=RUNE-PERP`,
  });

  const data = await ftx.requestDraft(openTriggersDraft);

  // console.log(data.result); // working

  const { result } = data;
  const triggerOrder = result.map((x) => {
    return {
      ticker: x.market,
      type: x.type,
      reduceOnly: x.reduceOnly,
      status: x.status, //open or closed
      side: x.side,
      size: x.size,
      triggerPrice: x.triggerPrice,
      triggeredAt: x.triggeredAt,
    };
  });

  console.log('logging triggerOrder:', triggerOrder);
  return triggerOrder;
};

fetchFtxData();

// const test = () => {
//   const start = now();
//   const d = bm.createDraft({
//     method: 'POST',
//     path: '/orders',
//     data: {
//       market: 'BTC-PERP',
//       size: 100 + i,
//       side: 'sell',
//       order_type: 'Limit',
//       price: 10000 - i,
//     },
//   });
//   console.log('drafting took', (now() - start).toFixed(5), 'ms');
// };

// let i = 0;
// const limit = 30;
// const loop = setInterval(() => {
//   if (i++ > limit) {
//     return clearInterval(loop);
//   }

//   setTimeout(test, 100);
// }, 200);
