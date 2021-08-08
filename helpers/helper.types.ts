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
  netSize: string;
  cost: string;
  asset: string;
  entryPrice: number;
  avgOpenPrice: string;
  breakEvenPrice: string;
  markPrice: number;
  longOrderSize: number;
  shortOrderSize: number;
  estimatedLiquidationPrice: number;
  unrealizedPnl: string;
}

export interface OrdersFormatted {
  id: number;
  market: string;
  type: string;
  side: string;
  price: number;
  size: number;
  status: string;
  filledSize: number;
  remainingSize: number;
}
