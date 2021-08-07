export interface Account {
  totalAccountValue: number;
  totalPositionSize: number;
  collateral: number;
  freeCollateral: number;
}

export interface Balances {
  coin: string;
  total: number;
  free: number;
  availableWithoutBorrow: number;
  usdValue: number;
  spotBorrow: number;
}

export interface OpenPosition {
  future: string;
  size: number;
  side: string;
  netSize: number;
  longOrderSize: number;
  shortOrderSize: number;
  cost: number;
  entryPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  initialMarginRequirement: number;
  maintenanceMarginRequirement: number;
  openSize: number;
  collateralUsed: number;
  estimatedLiquidationPrice: number;
  recentAverageOpenPrice: number;
  recentPnl: number;
  recentBreakEvenPrice: number;
  cumulativeBuySize: number;
  cumulativeSellSize: number;
}
