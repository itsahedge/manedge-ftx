import FTX from 'ftx-api-rest';

export const getAccountDetail = async () => {
  const key = process.env.KEY;
  const secret = process.env.SECRET;
  const subaccount = process.env.SUBACCOUNT;

  const ftx = new FTX({
    key,
    secret,
    subaccount,
  });

  const accountDraft = await ftx.createDraft({
    method: 'GET',
    path: '/account',
  });

  const data = await ftx.requestDraft(accountDraft);
  const {
    result: {
      username,
      totalAccountValue,
      totalPositionSize,
      collateral,
      freeCollateral,
    },
  } = data;

  return {
    username,
    totalAccountValue,
    totalPositionSize,
    collateral,
    freeCollateral,
  };
};
