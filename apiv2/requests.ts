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
      side: side.toUpperCase(),
      price,
      type: type.toUpperCase(),
      size,
    };
  } catch (error) {
    console.error(error);
  }
};
