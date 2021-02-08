require('dotenv').config();

const ngrok = require('ngrok');
const request = require("request");

const setupWebHook = (botToken, ngrokProxy) => new Promise((res, rej) => {
  request(
    `https://api.telegram.org/bot${botToken}/setWebhook?url=${ngrokProxy}/dev/translate-me`,
    (err, data) => err ? rej(err) : res(data),
  );
});

(async () => {
  const url = await ngrok.connect(3000);
  console.log('url : ', url);
  console.log('botToken: ', process.env.BOT_TOKEN);
  await setupWebHook(process.env.BOT_TOKEN, url);
})();
