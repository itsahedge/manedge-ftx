"use strict";
exports.__esModule = true;
exports.formatOpenPositions = exports.formatAccount = void 0;
var _ = require("lodash");
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
var formatOpenPositions = function (data) {
    // ticker: string; side: string; costUsd: any; netSize: any; recentAverageOpenPrice: any; recentBreakEvenPrice: any; entryPrice: any; recentPnl: any;
    // filter out the objects that has a size greater than 0
    var currentPositions = _.filter(data, function (p) {
        return p.size !== 0;
    }).map(function (o) {
        return {
            ticker: o.future,
            side: o.side,
            netSize: o.netSize,
            avgOpenPrice: o.recentAverageOpenPrice,
            breakEvenPrice: o.recentBreakEvenPrice,
            markPrice: o.entryPrice,
            longOrderSize: o.longOrderSize,
            shortOrderSize: o.shortOrderSize,
            estimatedLiquidationPrice: o.estimatedLiquidationPrice,
            unrealizedPnl: o.unrealizedPnl,
            recentPnl: o.recentPnl
        };
    });
    return currentPositions;
};
exports.formatOpenPositions = formatOpenPositions;
