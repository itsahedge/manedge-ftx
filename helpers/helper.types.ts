export interface AccountFormatted {
  totalAccountValue: string;
  totalPositionSize: string;
  collateral: string;
  freeCollateral: string;
  totalLeverage: string;
}

export interface OpenPositionsFormatted {
  ticker: string;
  side: string;
  netSize: number;
  cost: string;
  asset: string;
  entryPrice: number;
  avgOpenPrice: number;
  breakEvenPrice: number;
  markPrice: number;
  longOrderSize: number;
  shortOrderSize: number;
  estimatedLiquidationPrice: number;
  unrealizedPnl: string;
}
