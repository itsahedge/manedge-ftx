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
