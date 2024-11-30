import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { SessionsDAO } from "../interface/SessionsDAO";

export class SessionsDAODynamo implements SessionsDAO {
  private readonly tableName = "tweeter-sessions";
  private readonly expirationTime = 60 * 60 * 1000; // 1 hour expiration
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createSession(authToken: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        token: authToken.token,
        timestamp: authToken.timestamp.toString(),
      },
    };

    try {
      await this.client.send(new PutCommand(params));
    } catch {
      throw new Error("Error adding session");
    }
  }

  public async verifySession(authToken: AuthTokenDto): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        token: authToken.token,
      },
    };

    try {
      const response = await this.client.send(new GetCommand(params));
      if (!response.Item) {
        return false;
      }
      const tokenTimestamp = response.Item.timestamp as unknown as number;
      const timedOut = Date.now() - tokenTimestamp > this.expirationTime;
      return !timedOut;
    } catch {
      throw new Error("Error verifying session");
    }
  }
}
