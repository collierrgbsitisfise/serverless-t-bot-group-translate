import { APIGatewayEvent } from 'aws-lambda';
import 'source-map-support/register';

import { lambdaWrapper, logInfoToTelegram, validateEmail } from './../lib/utils';
import { UserEmailsRepository } from './../lib/repositories';

const saveEmail = async (event: APIGatewayEvent): Promise<[any, number]> => {
  const { email } = JSON.parse(event.body);

  if (!validateEmail(email)) {
    throw new Error(`invalid email ${email}`);
  }

  await UserEmailsRepository.saveUserEmail(email);
  await logInfoToTelegram(`User Subscibed for updated : ${email}`);
  return [{ success: true }, 200];
};

export const main = lambdaWrapper(saveEmail);
