import { User } from 'telegraf/typings/telegram-types';

export function buildPayForTransalteUrl(data: {
  baseUrl: string;
  chatId: number;
  chatTitle: string;
  userData: User;
}): string {
  const { chatId, baseUrl, chatTitle, userData } = data;
  const buffer = Buffer.from(
    JSON.stringify({
      chatId,
      chatTitle,
      userData,
      messenger: 'Telegram',
    }),
    'utf-8',
  );
  const base64String = buffer.toString('base64');

  return `${baseUrl}?chatData=${base64String}`;
}
