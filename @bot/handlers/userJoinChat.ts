import { TelegrafContext } from 'telegraf/typings/context';

export async function userJoinChat(ctx: TelegrafContext): Promise<void> {
  const { message } = ctx.update;
  const newChatMember = message.new_chat_members[0];
  await ctx.reply(
    `Welcome <a href="tg://user?id=${newChatMember.id}">${newChatMember.first_name} ${newChatMember.last_name}</a> !`,
    {
      parse_mode: 'HTML',
    },
  );

  await ctx.telegram.sendVideo(message.chat.id, {
    url: 'https://translate-me-bot-assets.s3.eu-west-2.amazonaws.com/setup-lang.mov',
    filename: 'how setup language',
  });
}
