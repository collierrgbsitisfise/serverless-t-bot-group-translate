import DynamoDb, { putResponse, getResponse, updateResponse } from './../dynamodb';

export class ChatBotRepository {
  static botID = 'TRANSLATE_ME_BOT';
  static tableName: string = process.env.USERS_TABLE;

  static updateSettings(item: updateBotSettingsParams): putResponse {
    const params = {
      TableName: ChatBotRepository.tableName,
      Item: {
        ...item,
        userId: ChatBotRepository.botID,
      },
    };

    return DynamoDb.put(params);
  }

  static getChatBot(chatId: string): getResponse {
    const params = {
      TableName: ChatBotRepository.tableName,
      Key: {
        userId: ChatBotRepository.botID,
        chatId,
      },
    };

    return DynamoDb.get(params);
  }

  static decrementAvailableTranslates(chatId: string): updateResponse {
    const params = {
      TableName: ChatBotRepository.tableName,
      Key: {
        chatId,
        userId: ChatBotRepository.botID,
      },
      UpdateExpression: 'SET #translatesAvailable = #translatesAvailable - :decrease',
      ExpressionAttributeNames: {
        '#translatesAvailable': 'translatesAvailable',
      },
      ExpressionAttributeValues: {
        ':decrease': 1,
      },
    };

    return DynamoDb.update(params);
  }

  static addTranslatesForAnChat(chatId: string, translateNumber: number): updateResponse {
    const params = {
      TableName: ChatBotRepository.tableName,
      Key: {
        chatId,
        userId: ChatBotRepository.botID,
      },
      UpdateExpression: 'SET #translatesAvailable = #translatesAvailable + :translateNumber',
      ExpressionAttributeNames: {
        '#translatesAvailable': 'translatesAvailable',
      },
      ExpressionAttributeValues: {
        ':translateNumber': translateNumber,
      },
    };

    return DynamoDb.update(params);
  }
}

export type updateBotSettingsParams = {
  chatId: string;
  settings: Record<string, unknown>;
  translatesAvailable: number;
};
