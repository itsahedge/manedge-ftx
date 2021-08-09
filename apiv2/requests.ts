import * as _ from 'lodash';

import { ftxClient } from '../config';
import { Account, Balances, Orders } from './v2.types';

export const getAccountData = async (): Promise<Account> => {
  const response = await ftxClient.getAccount();
  const { totalAccountValue, totalPositionSize, collateral, freeCollateral } =
    response.result;
  return { totalAccountValue, totalPositionSize, collateral, freeCollateral };
};

export const getBalanceData = async (): Promise<Balances[]> => {
  const response = await ftxClient.getBalances();
  const balances: Balances[] = response.result;
  return balances;
};

interface DepositAddress {
  coin: string;
  method?: string;
}

interface DepositAddressResponse {
  address: string;
  method: string;
}

export const getDepositAddress = async (
  data: DepositAddress
): Promise<DepositAddressResponse> => {
  const response = await ftxClient.getDepositAddress(data);
  const depositAddress: DepositAddressResponse = response.result;
  return depositAddress;
};

export const getOrdersData = async (ticker: string): Promise<Orders[]> => {
  const response = await ftxClient.getOpenOrders(ticker);
  const orders: Orders[] = response.result;
  return orders;
};

interface LimitOrder {
  id?: number;
  status?: string;
  market: string;
  side: string;
  price: number;
  type: string;
  size: number;
}

interface MarketOrder {
  id?: number;
  status?: string;
  type: string;
  market: string;
  side: string;
  price?: null;
  size: number;
}

export const placeMarketOrder = async (data: MarketOrder): Promise<any> => {
  try {
    const response = await ftxClient.placeOrder(data);
    const { id, status, type, market, side, size } = response.result;
    return { id, status, type, market, side, size };
  } catch (error) {
    console.error(error);
  }
};

export const placeLimitOrder = async (
  data: LimitOrder
): Promise<LimitOrder> => {
  try {
    const response = await ftxClient.placeOrder(data);
    const { id, status, market, side, price, type, size } = response.result;
    return {
      id,
      status,
      market,
      side,
      price,
      type,
      size,
    };
  } catch (error) {
    console.error(error);
  }
};
