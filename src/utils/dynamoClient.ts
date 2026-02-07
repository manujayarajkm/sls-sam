import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-east-1";

const { TABLE_NAME } = process.env;

const client = new DynamoDBClient({ region: REGION });
export const docClient = DynamoDBDocumentClient.from(client);

export async function putItem(item: Record<string, any>) {
  try {
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return true;
  } catch (err) {
    console.error("putItem error", err);
    throw err;
  }
}

export async function getItem(
  key: Record<string, any>,
): Promise<Record<string, any> | undefined> {
  try {
    const resp = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: key }),
    );
    return resp.Item;
  } catch (err) {
    console.error("getItem error", err);
    throw err;
  }
}

export async function queryItems(
  expressionAttributeNames: Record<string, any>,
  expressionValues: Record<string, any>,
): Promise<any[]> {
  try {
    const resp = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionValues,
      }),
    );
    return resp.Items || [];
  } catch (err) {
    console.error("queryItems error", err);
    throw err;
  }
}

export async function deleteItem(key: Record<string, any>): Promise<boolean> {
  try {
    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: key }),
    );
    return true;
  } catch (err) {
    console.error("deleteItem error", err);
    throw err;
  }
}
