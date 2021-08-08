"use strict";
exports.__esModule = true;
exports.formatOrders = exports.formatOpenPositions = exports.formatBalances = exports.formatAccount = exports.formatter = void 0;
var _ = require("lodash");
exports.formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});
var formatAccount = function (data) {
    var totalAccountValue = data.totalAccountValue, totalPositionSize = data.totalPositionSize, collateral = data.collateral, freeCollateral = data.freeCollateral;
    var formattedTotalAccountValue = exports.formatter.format(totalAccountValue);
    var formattedTotalPositionSize = exports.formatter.format(totalPositionSize);
    var formattedTotalCollateral = exports.formatter.format(collateral);
    var formattedFreeCollateral = exports.formatter.format(freeCollateral);
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
var formatBalances = function (data) {
    var balances = _.filter(data, function (b) {
        return b.total !== 0;
    });
    return balances;
};
exports.formatBalances = formatBalances;
var formatOpenPositions = function (data) {
    var currentPositions = _.filter(data, function (p) {
        return p.size !== 0;
    }).map(function (o) {
        return {
            ticker: o.future,
            side: o.side === 'buy' ? 'LONG' : 'SHORT',
            netSize: o.netSize.toLocaleString(),
            cost: exports.formatter.format(o.cost),
            asset: o.future.split('-')[0],
            entryPrice: o.entryPrice,
            avgOpenPrice: Number(o.recentAverageOpenPrice).toFixed(4),
            breakEvenPrice: Number(o.recentBreakEvenPrice).toFixed(4),
            markPrice: o.entryPrice,
            longOrderSize: o.longOrderSize,
            shortOrderSize: o.shortOrderSize,
            estimatedLiquidationPrice: o.estimatedLiquidationPrice,
            unrealizedPnl: exports.formatter.format(o.recentPnl)
        };
    });
    return currentPositions;
};
exports.formatOpenPositions = formatOpenPositions;
var formatOrders = function (data) {
    return _.map(data, function (o) {
        return {
            id: o.id,
            market: o.market,
            status: o.status,
            type: o.type.toUpperCase(),
            side: o.side.toUpperCase(),
            price: o.price,
            size: o.size,
            filledSize: o.filledSize,
            remainingSize: o.remainingSize
        };
    });
};
exports.formatOrders = formatOrders;
