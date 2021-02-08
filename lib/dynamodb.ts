import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

const client = new AWS.DynamoDB.DocumentClient();

export type getParams = AWS.DynamoDB.DocumentClient.GetItemInput;
export type putParams = AWS.DynamoDB.DocumentClient.PutItemInput;
export type queryParams = AWS.DynamoDB.DocumentClient.QueryInput;
export type updateParams = AWS.DynamoDB.DocumentClient.UpdateItemInput;
export type deleteParams = AWS.DynamoDB.DocumentClient.DeleteItemInput;

export type getResponse = Promise<PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>>;
export type putResponse = Promise<PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>>;
export type queryResponse = Promise<PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>>;
export type updateResponse = Promise<PromiseResult<AWS.DynamoDB.DocumentClient.UpdateItemOutput, AWS.AWSError>>;
export type deleteRespons = Promise<PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>>;

export default {
  get: (params: getParams): getResponse => client.get(params).promise(),
  put: (params: putParams): putResponse => client.put(params).promise(),
  query: (params: queryParams): queryResponse => client.query(params).promise(),
  update: (params: updateParams): updateResponse => client.update(params).promise(),
  delete: (params: deleteParams): deleteRespons => client.delete(params).promise(),
};
