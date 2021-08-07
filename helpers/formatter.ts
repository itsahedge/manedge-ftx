import * as _ from 'lodash';
import { Account, OpenPosition } from '../apiv2/v2.types';
import { AccountFormatted } from './helper.types';

const formatter = new Intl.NumberFormat('en-US', {
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

export const formatOpenPositions = (data: OpenPosition[]): any => {
  const currentPositions = _.filter(data, function (p) {
    return p.size !== 0;
  }).map((o) => {
    return {
      ticker: o.future,
      side: o.side,
      netSize: o.netSize,
      avgOpenPrice: o.recentAverageOpenPrice,
      breakEvenPrice: o.recentBreakEvenPrice,
      markPrice: o.entryPrice,
      longOrderSize: o.longOrderSize,
      shortOrderSize: o.shortOrderSize,
      estimatedLiquidationPrice: o.estimatedLiquidationPrice,
      unrealizedPnl: o.recentPnl,
    };
  });

  return currentPositions;
};
