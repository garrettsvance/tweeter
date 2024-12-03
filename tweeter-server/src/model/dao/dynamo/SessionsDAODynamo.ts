import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { SessionsDAO } from "../interface/SessionsDAO";

export class SessionsDAODynamo implements SessionsDAO {
  private readonly tableName = "tweeter-sessions";
  private readonly expirationTime = 60 * 60 * 1000; // 1 hour expiration
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createSession(authToken: AuthToken, user: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: user.alias,
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

  async getAliasFromToken(token: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        token: token,
      },
    };
    try {
      const response = await this.client.send(new GetCommand(params));
      const alias = response.Item
        ? response.Item.alias
          ? response.Item.alias
          : null
        : null;
      console.log(`Alias from token: ${alias}`);
      return alias;
    } catch {
      throw new Error("Error getting alias from token");
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
