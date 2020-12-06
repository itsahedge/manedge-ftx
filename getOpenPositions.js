import { accountEmbed } from './botMessages';
import { ftx, accountDraft, positionDraft, placeOrderDraft } from './constants';

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
            recentBreakEvenPrice: o.recentBreakEvenPrice,
            recentAverageOpenPrice: o.recentAverageOpenPrice,
            recentPnl: o.recentPnl,
          },
        ]
      : []
  );

  return openPositions;
};
