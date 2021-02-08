import { TelegrafContext } from 'telegraf/typings/context';
import { ChatUserRepository } from './../../lib/repositories';

export async function userLeftChat(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;
  const newChatMember = message.left_chat_member;
  const chat = message.chat;
  await ChatUserRepository.deleteChatUser(String(chat.id), String(newChatMember.id));
}
