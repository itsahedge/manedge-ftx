import FTX from 'ftx-api-rest';

require('dotenv').config();

const key = process.env.KEY;
const secret = process.env.SECRET;
const subaccount = process.env.SUBACCOUNT;

export const ftx = new FTX({
  key,
  secret,
  subaccount,
});

export const accountDraft = ftx.createDraft({
  method: 'GET',
  path: '/account',
});

export const positionDraft = ftx.createDraft({
  method: 'GET',
  path: '/positions?showAvgPrice=true',
});

// export const openTriggersDraft = ftx.createDraft({
//   method: 'GET',
//   path: '/conditional_orders?market={RUNE-PERP}',
// });

export const placeOrderDraft = (data) =>
  ftx.createDraft({
    method: 'POST',
    path: '/orders',
    data: data,
  });
