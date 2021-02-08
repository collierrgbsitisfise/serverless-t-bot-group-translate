import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

import { logErrorToTelegram } from './sendErrorToTelegram';

const onSuccesHandler = (
  data: any,
  statusCode: number,
): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(data),
});

const onErrorHandler = async (error): Promise<APIGatewayProxyResult> => {
  console.log('I am in error handler !!');
  console.log('error ', error);
  await logErrorToTelegram(error);
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(error),
  };
};

export const lambdaWrapper = (
  lambda: (event: APIGatewayEvent, context: Context, callback: Callback) => Promise<[any, number]>,
  onSucces: (
    value: any,
    statusCode: number,
  ) => APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> = onSuccesHandler,
  onError: (value: any) => Promise<APIGatewayProxyResult> = onErrorHandler,
) => {
  return function wrapp(event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then((val: [any, number]) => onSucces(val[0], val[1]))
      .catch(onError);
  };
};
