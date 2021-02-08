import { TelegrafContext } from 'telegraf/typings/context';

import { userJoinChat } from './userJoinChat';
import { userLeftChat } from './userLeftChat';
import { translateText } from './translateText';
import { setupSelectedLanguage } from './setupSelectedLanguage';
import { noAvaialbleTranslates } from './noAvailableTranslates';
import { translateBotJoinedTheChat } from './translateBotJoinedTheChat';
import availableLanguages from './../settings/languages.json';
import { ChatBotRepository } from './../../lib/repositories';

const isUserJoinChatMessage = (ctx: TelegrafContext) =>
  Array.isArray(ctx.updateSubTypes) && ctx.updateSubTypes.includes('new_chat_members');

const isUserLeftChatMessage = (ctx: TelegrafContext) =>
  Array.isArray(ctx.updateSubTypes) && ctx.updateSubTypes.includes('left_chat_member');

const isTranslateBotJoinedTheChat = (ctx: TelegrafContext) =>
  isUserJoinChatMessage(ctx) &&
  ctx.message.new_chat_members[0]['is_bot'] &&
  ctx.message.new_chat_members[0]['username'] === process.env.BOT_NAME;

const isTranslateBotLeftTheChat = (ctx: TelegrafContext) =>
  isUserLeftChatMessage(ctx) &&
  ctx.message.left_chat_member['is_bot'] &&
  ctx.message.left_chat_member['username'] === process.env.BOT_NAME;

const isSetupSelectedLanguageMessage = (ctx: TelegrafContext) => {
  const { message } = ctx.update;
  return availableLanguages.includes(message.text);
};

const isTranslateAvailable = async (ctx: TelegrafContext) => {
  const { message } = ctx.update;
  const res = (await ChatBotRepository.getChatBot(String(message.chat.id))).Item;
  return res && res.translatesAvailable > 0;
};

export async function textHandler(ctx: TelegrafContext): Promise<void> {
  if (isTranslateBotJoinedTheChat(ctx)) {
    console.log('TRanslateJoinedTheChat');
    await translateBotJoinedTheChat(ctx);
    return;
  }

  if (isTranslateBotLeftTheChat(ctx)) {
    console.log('bot was kicked from chat !!');
    // @TODO log somehow bot leave the chat
    return;
  }

  if (isUserJoinChatMessage(ctx)) {
    await userJoinChat(ctx);
    return;
  }

  if (isUserLeftChatMessage(ctx)) {
    await userLeftChat(ctx);
    return;
  }

  if (isSetupSelectedLanguageMessage(ctx)) {
    await setupSelectedLanguage(ctx);
    return;
  }

  if (!(await isTranslateAvailable(ctx))) {
    await noAvaialbleTranslates(ctx);
    return;
  }

  // try to translate only if text was sent
  if (ctx.update?.message?.text) {
    await translateText(ctx);
  }
}
