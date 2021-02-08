import { APIGatewayEvent } from 'aws-lambda';
import 'source-map-support/register';
import Stripe from 'stripe';

import { ChatBotRepository, ChatUserRepository } from './../lib/repositories';
import { Translator } from './../lib/services';
import bot from './../@bot/app';
import { formatTranslates } from './../@bot/helpers';
import { lambdaWrapper } from './../lib/utils';

const { STRIPE_WHSEC, STRIPE_SECRET } = process.env;

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

const stripeWebHook = async (event: APIGatewayEvent): Promise<[any, number]> => {
  const { headers, body } = event;

  console.log('stripe webHOOK');
  let webHookEvent;
  // @TODO create separate authorizer for stripe
  try {
    webHookEvent = stripe.webhooks.constructEvent(body, headers['Stripe-Signature'], STRIPE_WHSEC);
  } catch (err) {
    return ['invalid signature', 400];
  }

  console.log('webHookEvent');
  console.log(JSON.stringify(webHookEvent, null, 2));

  if (webHookEvent.type === 'charge.succeeded') {
    const metadata = webHookEvent?.data?.object?.metadata;
    console.log('metadata : ', metadata);
    await ChatBotRepository.addTranslatesForAnChat(metadata.chatId, 10);

    // @TODO separate from main logic
    try {
      const allUsers = (await ChatUserRepository.getAllChatUsers(metadata.chatId)).Items;
      const usersLanguages: Set<string> = allUsers
        .filter(({ userId }) => userId !== ChatBotRepository.botID)
        .map(({ settings }) => settings.language)
        .reduce((acc: Set<string>, curr: string) => {
          acc.add(curr);
          return acc;
        }, new Set());

      const translatesUserPaid = await Promise.all(
        [...usersLanguages].map(async (language: string) => {
          const translate = await Translator.translateText({
            text: `🦄🦄🦄 User with email - "${metadata.email}" paid ${metadata.price}$ for 10 additioanl translates ✨✨✨`,
            detectSourceLanguage: true,
            to: language,
          });
          return {
            language,
            translate,
          };
        }),
      );

      const translatesRefundInfo = await Promise.all(
        [...usersLanguages].map(async (language: string) => {
          const translate = await Translator.translateText({
            text: `Thanks for Your trust! In case of errors or to return funds, contact the <a href="tg://user?id=273859921">administrator</a>`,
            detectSourceLanguage: true,
            to: language,
          });
          return {
            language,
            translate,
          };
        }),
      );

      await bot.telegram.sendMessage(metadata.chatId, formatTranslates(translatesUserPaid), { parse_mode: 'HTML' });
      await bot.telegram.sendMessage(metadata.chatId, formatTranslates(translatesRefundInfo), { parse_mode: 'HTML' });
    } catch (err) {
      console.log('error : ', err);
    }
  }

  return [{ success: true }, 200];
};

export const main = lambdaWrapper(stripeWebHook);
