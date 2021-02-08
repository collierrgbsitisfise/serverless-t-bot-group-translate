import { APIGatewayEvent } from 'aws-lambda';
import 'source-map-support/register';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

import { lambdaWrapper } from './../lib/utils';

const { STRIPE_SECRET } = process.env;

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});
// @TODO add validation and schemas here please
const payForTranslates = async (event: APIGatewayEvent): Promise<[any, number]> => {
  const { email, price, chatId, userData, chatTitle } = JSON.parse(event.body);

  console.log('email : ', email);
  console.log('price : ', price);
  console.log('chatId : ', chatId);
  console.log('userData : ', userData);
  console.log('chatTitle : ', chatTitle);

  const idempotencyKey = uuidv4();

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: price * 1000,
      currency: 'usd',
      metadata: {
        integration_check: 'accept_a_payment',
        email,
        chatId,
        price,
        chatTitle,
        userId: userData.id,
        username: userData.username,
      },
    },
    { idempotencyKey },
  );

  return [{ clientSecret: paymentIntent.client_secret }, 200];
};

export const main = lambdaWrapper(payForTranslates);
