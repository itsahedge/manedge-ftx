"use strict";
exports.__esModule = true;
exports.formatAccount = void 0;
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});
var formatAccount = function (data) {
    var totalAccountValue = data.totalAccountValue, totalPositionSize = data.totalPositionSize, collateral = data.collateral, freeCollateral = data.freeCollateral;
    var formattedTotalAccountValue = formatter.format(totalAccountValue);
    var formattedTotalPositionSize = formatter.format(totalPositionSize);
    var formattedTotalCollateral = formatter.format(collateral);
    var formattedFreeCollateral = formatter.format(freeCollateral);
    // total position size / collateral = current leverge used
    var collateralFormatted = Number(collateral.toFixed(2));
    var totalLeverage = Number(totalPositionSize / collateralFormatted).toFixed(2);
    return {
        totalAccountValue: formattedTotalAccountValue,
        totalPositionSize: formattedTotalPositionSize,
        collateral: formattedTotalCollateral,
        freeCollateral: formattedFreeCollateral,
        totalLeverage: totalLeverage
    };
};
exports.formatAccount = formatAccount;
