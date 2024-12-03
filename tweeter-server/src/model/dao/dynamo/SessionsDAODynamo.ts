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
    console.log(
      `Creating session for user: ${user.alias} with token: ${authToken.token}`,
    );

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
      console.log(`Session created successfully for user: ${user.alias}`);
    } catch (error) {
      console.error(`Error adding session for user: ${user.alias}`, error);
      throw new Error("Error adding session");
    }
  }

  async getAliasFromToken(token: string): Promise<string> {
    console.log(`Fetching alias for token: ${token}`);

    const params = {
      TableName: this.tableName,
      Key: {
        token: token,
      },
    };

    try {
      const response = await this.client.send(new GetCommand(params));
      if (response.Item) {
        console.log(`Alias found for token: ${response.Item.alias}`);
        return response.Item.alias;
      } else {
        console.log(`No session found for token: ${token}`);
        throw new Error("No session found for token");
      }
    } catch (error) {
      console.error(`Error getting alias for token: ${token}`, error);
      throw new Error("Error getting alias from token");
    }
  }

  public async verifySession(authToken: AuthTokenDto): Promise<boolean> {
    console.log(`Verifying session for token: ${authToken.token}`);

    const params = {
      TableName: this.tableName,
      Key: {
        token: authToken.token,
      },
    };

    try {
      const response = await this.client.send(new GetCommand(params));

      if (!response.Item) {
        console.log(`No session found for token: ${authToken.token}`);
        return false;
      }

      const tokenTimestamp = Number(response.Item.timestamp);
      const currentTime = Date.now();
      const isExpired = currentTime - tokenTimestamp > this.expirationTime;

      console.log(
        `Session status for token: ${authToken.token}, Expired: ${isExpired}`,
      );
      return !isExpired;
    } catch (error) {
      console.error(
        `Error verifying session for token: ${authToken.token}`,
        error,
      );
      throw new Error("Error verifying session");
    }
  }
}
