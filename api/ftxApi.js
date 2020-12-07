import FTX from 'ftx-api-rest';
import { type } from 'os';

export const getAccountDetail = async () => {
  const key = process.env.KEY;
  const secret = process.env.SECRET;
  const subaccount = process.env.SUBACCOUNT;

  const ftx = new FTX({
    key,
    secret,
    subaccount,
  });

  const draft = await ftx.createDraft({
    method: 'GET',
    path: '/account',
  });

  const data = await ftx.requestDraft(draft);
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

export const getOpenPositions = async () => {
  const key = process.env.KEY;
  const secret = process.env.SECRET;
  const subaccount = process.env.SUBACCOUNT;

  const ftx = new FTX({
    key,
    secret,
    subaccount,
  });

  const draft = await ftx.createDraft({
    method: 'GET',
    path: '/positions?showAvgPrice=true',
  });

  const data = await ftx.requestDraft(draft);

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
            recentBreakEvenPrice: o.recentBreakEvenPrice,
            recentAverageOpenPrice: o.recentAverageOpenPrice,
            recentPnl: o.recentPnl,
          },
        ]
      : []
  );

  // console.log(openPositions);
  return openPositions;
};

// pass in a ticker argument, to which you pass to createDraft
export const getOpenOrders = async (newTicker) => {
  const key = process.env.KEY;
  const secret = process.env.SECRET;
  const subaccount = process.env.SUBACCOUNT;

  const ftx = new FTX({
    key,
    secret,
    subaccount,
  });

  const draft = await ftx.createDraft({
    method: 'GET',
    path: `/orders?market=${newTicker}`, // accept ticker argument market={ticker}
  });

  const data = await ftx.requestDraft(draft);
  const { result } = data; // array
  console.log(result);

  const openOrders = result.flatMap((o) =>
    o.status === 'open'
      ? [
          {
            market: o.market,
            type: o.type,
            status: o.status,
            price: o.price,
            size: o.size,
            remainingSize: o.remainingSize,
          },
        ]
      : []
  );

  console.log(openOrders);

  return openOrders;
};
