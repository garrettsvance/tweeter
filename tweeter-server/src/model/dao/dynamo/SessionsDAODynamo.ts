import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
import { SessionsDAO } from "../interface/SessionsDAO";

export class SessionsDAODynamo implements SessionsDAO {
  private readonly tableName = "tweeter-sessions";
  private readonly token = "token";
  private readonly timestamp = "timestamp";
  private readonly expirationTime = 60 * 60 * 1000; // 1 hour expiration
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createSession(authToken: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        token: { S: authToken.token },
        timestamp: { N: authToken.timestamp.toString() },
      },
    };

    try {
      await this.client.send(new PutItemCommand(params));
    } catch {
      throw new Error("Error adding session");
    }
  }

  public async verifySession(authToken: AuthToken): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        token: { S: authToken.token },
      },
    };

    try {
      const response = await this.client.send(new GetItemCommand(params));
      const foundToken = response.Item ? !!response.Item.token : false;
      const timedOut = response.Item
        ? Date.now() - response.Item.timestamp <= this.expirationTime
        : false;
      return result != null;
    } catch {
      throw new Error("Error verifying session");
    }
  }
}
