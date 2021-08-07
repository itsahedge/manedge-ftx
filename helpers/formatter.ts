import { Account } from "../apiv2/v2.types";
import { AccountFormatted } from "./helper.types"

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export const formatAccount = (data: Account): AccountFormatted => {
  const { totalAccountValue, totalPositionSize,  collateral, freeCollateral } = data;

  const formattedTotalAccountValue = formatter.format(totalAccountValue)
  const formattedTotalPositionSize = formatter.format(totalPositionSize)
  const formattedTotalCollateral = formatter.format(collateral)
  const formattedFreeCollateral = formatter.format(freeCollateral)

  // total position size / collateral = current leverge used
  const collateralFormatted = Number(collateral.toFixed(2))
  const totalLeverage = Number(totalPositionSize/collateralFormatted).toFixed(2);
  return {
    totalAccountValue: formattedTotalAccountValue,
    totalPositionSize: formattedTotalPositionSize,
    collateral: formattedTotalCollateral,
    freeCollateral: formattedFreeCollateral,
    totalLeverage
  }
}