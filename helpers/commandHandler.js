"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.fetchAccount = void 0;
var requests_1 = require("../apiv2/requests");
var formatter_1 = require("../helpers/formatter");
var fetchAccount = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var data, formattedData, totalAccountValue, totalPositionSize, collateral, freeCollateral, totalLeverage, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, requests_1.getAccountData()];
            case 1:
                data = _a.sent();
                formattedData = formatter_1.formatAccount(data);
                totalAccountValue = formattedData.totalAccountValue, totalPositionSize = formattedData.totalPositionSize, collateral = formattedData.collateral, freeCollateral = formattedData.freeCollateral, totalLeverage = formattedData.totalLeverage;
                msg.channel.send("\n    **\uD83D\uDCB0: " + totalAccountValue + "**\n**Total Collateral**: " + collateral + "\n**Total Position Size**: " + totalPositionSize + "\n**Free Collateral**: " + freeCollateral + "\n**Leverage Used: **" + totalLeverage + "x\n\n  ");
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log('API Error', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchAccount = fetchAccount;
// export const fetchPositions = async (msg: {
//   guild?: { emojis: { cache: any[] } };
//   content?: string;
//   channel: any;
// }) => {
//   try {
//     const data = await getOpenPositionData();
//     console.log('from fetchPositions: ', data);
//     msg.channel.send(`${data}`);
//   } catch (error) {
//     console.log('API Error', error);
//   }
// };
