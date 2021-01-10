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
      leverage
    },
  } = data;

  return {
    username,
    totalAccountValue,
    totalPositionSize,
    collateral,
    freeCollateral,
    leverage
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
            recentBreakEvenPrice: Number(o.recentBreakEvenPrice).toFixed(4),
            recentAverageOpenPrice: Number(o.recentAverageOpenPrice).toFixed(4),
            recentPnl: o.recentPnl,
          },
        ]
      : []
  );

  return openPositions;
};

export const getTriggerOrders = async (ftx, ticker) => {
  const data = await ftx.request({
    method: 'GET',
    path: `/conditional_orders?market=${ticker}`, // accept ticker argument market={ticker}
  });

  const { result } = data;

  const openTriggers = result.flatMap((o) => {
    console.log(o)
    if (o.status === 'open') {
      return [{
        id: o.id,
        market: o.market,
        size: o.size,
        status: o.status,
        type: o.type, // market/limit
        orderType: o.orderType,
        triggerPrice: o.triggerPrice,
        triggeredAt: o.triggeredAt,
        estimatedReturn: o.triggerPrice * o.size
      }]
    } else {
      console.log('didnt work')
    }
  });

  return openTriggers
}

export const cancelAllOrders = async (ftx, ticker) => {
  const data = await ftx.request({
    method: 'DELETE',
    path: `/orders?market=${ticker}`, // accept ticker argument market={ticker}
  });

  const { result } = data;
  console.log("result: ", result)

  return {
    message: `${result}`
  }
}

export const placeTriggerOrders = async (ftx, ticker) => {
  const data = await ftx.request({
    method: 'POST',
    path: `/conditional_orders`, // accept ticker argument market={ticker}
  });

  const { result } = data;

  const triggers = result.flatMap((o) => {
    console.log(o)
    if (o.status === 'open') {
      return [{
        market: o.market,
        side: o.side,
        size: o.size,
        type: o.type
      }]
    } else {
      console.log('didnt work')
    }
  });

  return triggers
}

// pass in a ticker argument, to which you pass to createDraft
export const getOpenOrders = async (ftx, ticker) => {
  const data = await ftx.request({
    method: 'GET',
    path: `/orders?market=${ticker}`, // accept ticker argument market={ticker}
  });

  const { result } = data;

  console.log(result)

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
