import * as _ from 'lodash';
import { Account, Balances, OpenPosition, Orders } from '../apiv2/v2.types';
import {
  AccountFormatted,
  OpenPositionsFormatted,
  OrdersFormatted,
} from './helper.types';

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const formatAccount = (data: Account): AccountFormatted => {
  const { totalAccountValue, totalPositionSize, collateral, freeCollateral } =
    data;

  const formattedTotalAccountValue = formatter.format(totalAccountValue);
  const formattedTotalPositionSize = formatter.format(totalPositionSize);
  const formattedTotalCollateral = formatter.format(collateral);
  const formattedFreeCollateral = formatter.format(freeCollateral);

  // total position size / collateral = current leverge used
  const collateralFormatted = Number(collateral.toFixed(2));
  const totalLeverage = Number(totalPositionSize / collateralFormatted).toFixed(
    2
  );

  return {
    totalAccountValue: formattedTotalAccountValue,
    totalPositionSize: formattedTotalPositionSize,
    collateral: formattedTotalCollateral,
    freeCollateral: formattedFreeCollateral,
    totalLeverage,
  };
};

export const formatBalances = (data: Balances[]): Balances[] => {
  const balances = _.filter(data, function (b) {
    return b.total !== 0;
  });

  return balances;
};

export const formatOpenPositions = (
  data: OpenPosition[]
): OpenPositionsFormatted[] => {
  const currentPositions = _.filter(data, function (p) {
    return p.size !== 0;
  }).map((o) => {
    return {
      ticker: o.future,
      side: o.side === 'buy' ? 'LONG' : 'SHORT',
      netSize: o.netSize.toLocaleString(),
      cost: formatter.format(o.cost),
      asset: o.future.split('-')[0],
      entryPrice: o.entryPrice,
      avgOpenPrice: Number(o.recentAverageOpenPrice).toFixed(4),
      breakEvenPrice: Number(o.recentBreakEvenPrice).toFixed(4),
      markPrice: o.entryPrice,
      longOrderSize: o.longOrderSize,
      shortOrderSize: o.shortOrderSize,
      estimatedLiquidationPrice: o.estimatedLiquidationPrice,
      unrealizedPnl: formatter.format(o.recentPnl),
    };
  });

  return currentPositions;
};

export const formatOrders = (data: Orders[]): OrdersFormatted[] => {
  return _.map(data, (o) => {
    return {
      id: o.id,
      market: o.market,
      status: o.status,
      type: o.type.toUpperCase(),
      side: o.side.toUpperCase(),
      price: o.price,
      size: o.size,
      filledSize: o.filledSize,
      remainingSize: o.remainingSize,
    };
  });
};
