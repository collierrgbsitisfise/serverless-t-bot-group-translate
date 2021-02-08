import DynamoDb, { putResponse, getResponse, queryResponse, deleteRespons } from './../dynamodb';

export class ChatUserRepository {
  static tableName: string = process.env.USERS_TABLE;

  static updateUserSettings(item: updateUserSettingsParams): putResponse {
    const params = {
      TableName: ChatUserRepository.tableName,
      Item: item,
    };

    return DynamoDb.put(params);
  }

  static getUserById(chatId: string, userId: string): getResponse {
    const params = {
      TableName: ChatUserRepository.tableName,
      Key: {
        userId,
        chatId,
      },
    };

    return DynamoDb.get(params);
  }

  static async getAllChatUsers(chatId: string): queryResponse {
    const params = {
      TableName: ChatUserRepository.tableName,
      KeyConditionExpression: '#chatId = :chatIdValue AND #userId > :userIdValue',
      ExpressionAttributeNames: {
        '#chatId': 'chatId',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':chatIdValue': chatId,
        ':userIdValue': '0',
      },
    };

    return DynamoDb.query(params);
  }

  static async deleteChatUser(chatId: string, userId: string): deleteRespons {
    const params = {
      TableName: ChatUserRepository.tableName,
      Key: {
        chatId,
        userId,
      },
    };
    return DynamoDb.delete(params);
  }
}

export type userSettings = {
  language: string;
};

export type botSettings = {
  translatesAvailable: number;
};

export type updateUserSettingsParams = {
  userId: string;
  chatId: string;
  settings: userSettings;
};
