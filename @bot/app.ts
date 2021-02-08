import Telegraf from 'telegraf';

import { textHandler, setupHandler, startHandler, helpHandler } from './handlers';
import { logErrorToTelegram } from './../lib/utils';

const { BOT_TOKEN } = process.env;
console.log('BOT TOKEN IS HERE:', BOT_TOKEN);

const bot = new Telegraf(BOT_TOKEN);

bot.catch(async (err: Error) => {
  await logErrorToTelegram(err);
});

bot.use(async (ctx, next) => {
  console.log('ctx: ', JSON.stringify(ctx, null, 2));
  const start = Number(new Date());
  await next();
  const ms = Number(new Date()) - start;
  console.log('Response time: %sms', ms);
});

bot.start(startHandler);
bot.command('setup', setupHandler);
bot.command('help', helpHandler);
bot.on('message', textHandler);

export default bot;
