import { TelegrafContext } from 'telegraf/typings/context';

import { Translator } from './../../lib/services';

const text = `Translate Bot greets you! In order to configure the language for a specific chat use " /setup " command! This command must be executed in the appropriate chat. Don't forget to add the bot to the chat!`;

export async function helpHandler(ctx: TelegrafContext): Promise<void> {
  const languageCode = ctx.update.message?.from?.language_code;
  await ctx.reply(`${text} 🤓🤓🤓`);
  if (languageCode && languageCode !== 'en') {
    const translate = await Translator.translateText({
      text: text,
      from: 'en',
      to: languageCode,
    });
    ctx.reply(`${translate} 🤓🤓🤓`);
  }
}
