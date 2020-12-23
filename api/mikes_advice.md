it seems like you are doing something like:

const draft = ftx.createDraft();
const resp = await ftx.requestDraft(draft);
// a minute later
const resp2 = await ftx.requestDraft(draft);
and that won't work. Instead it's easier to not use drafts but use request straight away:

const resp = await ftx.request({...});
const resp2 = await ftx.request({...});
const resp3 = await ftx.request({...});
const resp4 = await ftx.request({...});
// a minute later
const resp5 = await ftx.request({...});
