import { client } from "../config"
import { Account } from "./v2.types";


export const getAccountDetailV2 = async (): Promise<Account> => {
  const response = await client.getAccount()
  const { totalAccountValue, totalPositionSize, collateral, freeCollateral } = response.result;
  return { totalAccountValue, totalPositionSize, collateral, freeCollateral }
};