import bot from './../../@bot/app';

const { ENV } = process.env;

export const logInfoToTelegram = async (message: string): Promise<void> => {
  await bot.telegram.sendMessage(273859921, `INFO ON ${ENV} \n ${message}`);
};
