import * as _ from 'lodash';

import { ftxClient } from '../config';
import { Account, Balances } from './v2.types';

export const getAccountData = async (): Promise<Account> => {
  const response = await ftxClient.getAccount();
  const { totalAccountValue, totalPositionSize, collateral, freeCollateral } =
    response.result;
  return { totalAccountValue, totalPositionSize, collateral, freeCollateral };
};

export const getBalanceData = async (): Promise<Balances[]> => {
  const response = await ftxClient.getBalances();
  const balances = response.result;
  return balances;
};
