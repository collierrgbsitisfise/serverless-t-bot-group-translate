require('dotenv').config();

const ngrok = require('ngrok');
const request = require("request");
const fs = require('fs');

const setupWebHook = (botToken, api) => new Promise((res, rej) => {
  console.log('CURL  : ', `https://api.telegram.org/bot${botToken}/setWebhook?url=${api}`);
  request(
    `https://api.telegram.org/bot${botToken}/setWebhook?url=${api}`,
    (err, data) => err ? rej(err) : res(data),
  );
});

(async () => {
  console.log('setup telegram webhook');
  const { ENV, DOMAIN_NAME, BOT_TOKEN } = process.env;
  console.log('webHook : ', `https://${DOMAIN_NAME}/translate-me`);
  await setupWebHook(BOT_TOKEN, `https://${DOMAIN_NAME}/translate-me`);
})();
