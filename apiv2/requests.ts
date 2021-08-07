import { ftxClient } from '../config';
import { Account } from './v2.types';

export const getAccountData = async (): Promise<Account> => {
  const response = await ftxClient.getAccount();
  const { totalAccountValue, totalPositionSize, collateral, freeCollateral } =
    response.result;
  return { totalAccountValue, totalPositionSize, collateral, freeCollateral };
};
