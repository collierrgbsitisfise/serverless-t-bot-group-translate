import { TelegrafContext } from 'telegraf/typings/context';
import { Translator } from './../../lib/services';
import { formatTranslates } from './../helpers';
import { ChatUserRepository, ChatBotRepository } from './../../lib/repositories';
import { logInfoToTelegram } from '../../lib/utils';

export async function translateText(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;
  const allUsers = (await ChatUserRepository.getAllChatUsers(String(message.chat.id))).Items;
  let userSettings = (await ChatUserRepository.getUserById(String(message.chat.id), String(message.from.id)))?.Item
    ?.settings;

  if (!userSettings) {
    await logInfoToTelegram(`user have not settings: ${JSON.stringify(ctx.update, null, 2)}`);
    userSettings = {};
  }

  const usersLanguages: Set<string> = allUsers
    .filter(({ settings, userId }) => {
      const filterBot = userId !== ChatBotRepository.botID;
      const filterTheSameLanguageAsUser = settings.language !== userSettings.language;
      if (message.chat.type === 'private') {
        return filterBot;
      }
      return filterBot && filterTheSameLanguageAsUser;
    })
    .map(({ settings }) => settings.language)
    .reduce((acc: Set<string>, curr: string) => {
      acc.add(curr);
      return acc;
    }, new Set());

  if (!usersLanguages?.size) {
    return;
  }

  const translates = await Promise.all(
    [...usersLanguages].map(async (language: string) => {
      const translate = await Translator.translateText({
        text: message.text,
        detectSourceLanguage: true,
        to: language,
      });
      return {
        language,
        translate,
      };
    }),
  );

  await Promise.all([
    ctx.reply(formatTranslates(translates), {
      reply_to_message_id: message.message_id,
      parse_mode: 'HTML',
    }),
    ChatBotRepository.decrementAvailableTranslates(String(message.chat.id)),
  ]);
}
