import { TelegrafContext } from 'telegraf/typings/context';

import { Translator } from './../../lib/services';
import { ChatUserRepository } from './../../lib/repositories';
import { logInfoToTelegram } from '../../lib/utils';

export async function setupSelectedLanguage(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;
  const language = message.text.match(/([^[]+(?=]))/g).pop();

  const [translated] = await Promise.all([
    Translator.translateText({
      text: 'Language was setup !',
      detectSourceLanguage: true,
      to: language,
    }),
    ChatUserRepository.updateUserSettings({
      userId: String(message.from.id),
      chatId: String(message.chat.id),
      settings: {
        language,
      },
    }),
  ]);
  await ctx.reply(translated);
  await logInfoToTelegram(`USER SETUP LANGUAGE(${language}): ${JSON.stringify(ctx.update, null, 2)}`);
}
