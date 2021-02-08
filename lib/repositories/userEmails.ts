import DynamoDb, { putResponse } from './../dynamodb';

export class UserEmailsRepository {
  static botID = 'TRANSLATE_ME_BOT';
  static tableName: string = process.env.EMAILS_TABLE;

  static saveUserEmail(email: string): putResponse {
    const params = {
      TableName: UserEmailsRepository.tableName,
      Item: {
        email,
        createdAt: Number(new Date()),
      },
    };

    return DynamoDb.put(params);
  }
}
