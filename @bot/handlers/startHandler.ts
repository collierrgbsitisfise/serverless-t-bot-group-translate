import { TelegrafContext } from 'telegraf/typings/context';
import { ChatBotRepository } from '../../lib/repositories';

import { Translator } from './../../lib/services';
import { logInfoToTelegram } from './../../lib/utils';
import { helpHandler } from './helpHandler';

const text = `This bot is intended for use in group chats. 👋👋👋 For simultaneous translation of a message into the native language of the participants. 💬💬💬 In case of any question or proposal adress to`;

const { ENV } = process.env;

const FREE_TRANLATES = ENV === 'prod' ? 1000 : 10;

export async function startHandler(ctx: TelegrafContext): Promise<void> {
  const languageCode = ctx.update.message?.from?.language_code;
  await ctx.reply(`${text} @vadim0nicolaev 🤓🤓🤓`);
  if (languageCode && languageCode !== 'en') {
    const translate = await Translator.translateText({
      text: text,
      from: 'en',
      to: languageCode,
    });
    ctx.reply(`${translate} @vadim0nicolaev 🤓🤓🤓`);
  }
  await helpHandler(ctx);
  await logInfoToTelegram(`new User was joined BOT: ${JSON.stringify(ctx.update.message?.chat, null, 2)}`);
  const { message } = ctx.update;

  const prevBotSettings = (await ChatBotRepository.getChatBot(String(message.chat.id)))?.Item;
  await ChatBotRepository.updateSettings({
    chatId: String(message.chat.id),
    settings: {},
    translatesAvailable:
      prevBotSettings && typeof prevBotSettings.translatesAvailable === 'number'
        ? prevBotSettings.translatesAvailable
        : FREE_TRANLATES,
  });

  return;
}
