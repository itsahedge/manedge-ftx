If i want to turn this into the FTX Discord position bot...

User Story for FTX BOT:

1. User send READ-ONlY

---

Need to fix getOpenTriggerOrders() so that the URL is being passed in dynamically.

- we first need to call the getOpenPositions() function to get the correct tickers

- only after calling the getOpenPositions() function, will we be able get the associate ticker from the response: i.e. RUNE-PERP

- we then need to pass this ticker response into the next call..

- i mean, we dont REALLY need to have it called together tbh.

- DFG Shill says:
  so basically you want to extract all the possible ticker ids from openPositions into an array, and then map that array to the network request to get that new data, and then probably Promise.allSettled to extract them again

https://www.sitepoint.com/discord-bot-node-js/

https://leovoel.github.io/embed-visualizer/
# ftx-trade-management-bot
