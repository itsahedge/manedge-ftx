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
    var currentPositions = _.filter(data, function (p) {
        return p.size !== 0;
    }).map(function (o) {
        return {
            ticker: o.future,
            side: o.side === 'buy' ? 'LONG' : 'SHORT',
            netSize: o.netSize,
            cost: formatter.format(o.cost),
            asset: o.future.split('-')[0],
            entryPrice: o.entryPrice,
            avgOpenPrice: o.recentAverageOpenPrice,
            breakEvenPrice: o.recentBreakEvenPrice,
            markPrice: o.entryPrice,
            longOrderSize: o.longOrderSize,
            shortOrderSize: o.shortOrderSize,
            estimatedLiquidationPrice: o.estimatedLiquidationPrice,
            unrealizedPnl: formatter.format(o.recentPnl)
        };
    });
    return currentPositions;
};
exports.formatOpenPositions = formatOpenPositions;
