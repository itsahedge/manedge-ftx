import FTX from 'ftx-api-rest';

export const getAccountDetail = async (ftx) => {
  const data = await ftx.request({
    method: 'GET',
    path: '/account'
  });

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

export const getOpenPositions = async (ftx) => {
  const data = await ftx.request({
    method: 'GET',
    path: '/positions?showAvgPrice=true',
  });

  const { result } = data;

  const openPositions = result.flatMap((o) =>
    o.entryPrice !== null
      ? [
          {
            ticker: o.future,
            side: o.side === "buy" ? "LONG" : "SHORT",
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
            id: o.id,
            market: o.market,
            type: o.type.toUpperCase(),
            side: o.side.toUpperCase(),
            status: o.status.toUpperCase(),
            price: o.price,
            size: o.size,
            remainingSize: o.remainingSize,
            filledSize: o.filledSize,
          },
        ]
      : []
  );

  console.log(openOrders);

  return openOrders;
};
