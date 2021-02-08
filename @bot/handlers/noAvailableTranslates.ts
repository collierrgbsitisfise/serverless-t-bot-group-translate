import { TelegrafContext } from 'telegraf/typings/context';

import { ChatUserRepository } from './../../lib/repositories';
import { Translator } from './../../lib/services';
import { buildPayForTransalteUrl } from './../helpers';

export async function noAvaialbleTranslates(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;

  const payForTransaltesUrl = buildPayForTransalteUrl({
    baseUrl: process.env.PAY_URL,
    chatId: message.chat.id,
    chatTitle: message.chat.title,
    userData: message.from,
  });

  const { settings: userSettings } = (
    await ChatUserRepository.getUserById(String(message.chat.id), String(message.from.id))
  ).Item;

  const orignalText = `There is no more free translates 😢 ! You can buy additional trnaslates 💳 !`;
  const translate = await Translator.translateText({
    text: orignalText,
    detectSourceLanguage: true,
    to: userSettings.language,
  });

  await ctx.reply(orignalText, { parse_mode: 'HTML' });
  await ctx.reply(translate, { parse_mode: 'HTML' });
  await ctx.reply(`<a href='${payForTransaltesUrl}'>${payForTransaltesUrl}</a>`, { parse_mode: 'HTML' });
}
