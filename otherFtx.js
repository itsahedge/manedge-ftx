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
          },
        ]
      : []
  );

  return openPositions;
};

// GET ALL OPEN ORDERS

// PLACE AN ORDER
const placeOrder = async () => {
  // the values in the data object will need to be dynamic
  // taken from discord user input
  const data = {
    market: 'RUNE-PERP',
    size: 1,
    side: 'buy',
    order_type: 'Limit',
    price: 0.5,
  };

  const placeOrder = placeOrderDraft(data);
  const order = await ftx.requestDraft(placeOrder);

  // console.log(order);

  return order;
};
