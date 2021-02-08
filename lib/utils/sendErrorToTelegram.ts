import bot from './../../@bot/app';

const { ENV } = process.env;

export const logErrorToTelegram = async (error: Error): Promise<void> => {
  await bot.telegram.sendMessage(273859921, `ERROR ON ${ENV} \n ${String(error)}`);
};
