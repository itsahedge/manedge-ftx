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

export const getTriggerOrders = async () => {
  console.log('test')
}

// pass in a ticker argument, to which you pass to createDraft
export const getOpenOrders = async (ftx, ticker) => {
  const data = await ftx.request({
    method: 'GET',
    path: `/orders?market=${ticker}`, // accept ticker argument market={ticker}
  });

  const { result } = data;

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

  return openOrders;
};
