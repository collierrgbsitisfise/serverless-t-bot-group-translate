import { TelegrafContext } from 'telegraf/typings/context';
import Markup from 'telegraf/markup';

import availableLanguages from './../settings/languages.json';
import { chunkArray } from './../helpers';
import { logInfoToTelegram } from '../../lib/utils';

export async function setupHandler(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;
  const messageID = message.message_id;
  const text = `<a href="tg://user?id=${message.from.id || ''}">Select Native Language !</a>`;
  await ctx.reply(text, {
    reply_to_message_id: messageID,
    parse_mode: 'HTML',
    ...Markup.keyboard(chunkArray(availableLanguages, 2)).selective(true).oneTime(false).resize().extra(),
  });
  await logInfoToTelegram(`USER SEND SETUP COMAND: ${JSON.stringify(ctx.update, null, 2)}`);
  return;
}
