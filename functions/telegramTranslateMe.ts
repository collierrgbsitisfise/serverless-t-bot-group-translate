import { APIGatewayEvent } from 'aws-lambda';
import 'source-map-support/register';
import bot from './../@bot/app';

import { lambdaWrapper } from './../lib/utils';

const translateMe = async (event: APIGatewayEvent): Promise<[any, number]> => {
  console.log('ENV :', process.env);
  // @TODO check if it is realy telegram !!!
  const telegramEvent = JSON.parse(event.body);
  await bot.handleUpdate(telegramEvent);
  return [{ success: true }, 200];
};

export const main = lambdaWrapper(translateMe);
