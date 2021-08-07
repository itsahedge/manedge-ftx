require('dotenv').config();

import { RestClient } from "ftx-api"

// const restClientOptions = {
//   // override the max size of the request window (in ms)
//   // recv_window?: number;

//   // // how often to sync time drift with FTX servers
//   // sync_interval_ms?: number | string;

//   // // Default: false. Disable above sync mechanism if true.
//   // disable_time_sync?: boolean;

//   // // Default: false. If true, we'll throw errors if any params are undefined
//   // strict_param_validation?: boolean;

//   // // Optionally override API protocol + domain
//   // // e.g 'https://ftx.us/api'
//   // baseUrl?: string;

//   // // Default: true. whether to try and post-process request exceptions.
//   // parse_exceptions?: boolean;

//   // // Subaccount nickname URI-encoded
//   // subAccountName?: string;
// };

// examples: 
// https://github.com/tiagosiebler/ftx-api/blob/HEAD/src/rest-client.ts

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const client = new RestClient(
  API_KEY,
  PRIVATE_KEY,

  // restClientOptions,
  // requestLibraryOptions
);
