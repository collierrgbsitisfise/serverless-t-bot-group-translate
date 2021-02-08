import { TelegrafContext } from 'telegraf/typings/context';
import Markup from 'telegraf/markup';

import availableLanguages from './../settings/languages.json';
import { chunkArray } from './../helpers';
import { ChatBotRepository } from './../../lib/repositories';
import { logInfoToTelegram } from './../../lib/utils';

const { ENV } = process.env;

const FREE_TRANLATES = ENV === 'prod' ? 1000 : 10;

export async function translateBotJoinedTheChat(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;
  const newChatMember = message.new_chat_members[0];

  const prevBotSettings = (await ChatBotRepository.getChatBot(String(message.chat.id))).Item;
  await ChatBotRepository.updateSettings({
    chatId: String(message.chat.id),
    settings: {},
    translatesAvailable:
      prevBotSettings && typeof prevBotSettings.translatesAvailable === 'number'
        ? prevBotSettings.translatesAvailable
        : FREE_TRANLATES,
  });

  await ctx.reply(
    `👋 👋 👋  <a href="tg://user?id=${newChatMember.id}">Translate BOT has joined the chat !!!</a> ✨✨✨`,
    {
      parse_mode: 'HTML',
    },
  );

  await ctx.reply('Hey, select native language !', {
    parse_mode: 'HTML',
    ...Markup.keyboard(chunkArray(availableLanguages, 2)).resize().extra(),
  });
  await logInfoToTelegram(`BOT JOIN NEW GROUP: ${JSON.stringify(ctx.update.message?.chat, null, 2)}`);
}
