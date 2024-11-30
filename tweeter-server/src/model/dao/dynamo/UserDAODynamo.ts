import { UserDAO } from "../interface/UserDAO";
import { User } from "tweeter-shared";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class UserDAODynamo implements UserDAO {
  private readonly tableName = "tweeter-users";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async associatePasswordAddUser(
    user: User,
    hashedPassword: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        hashedPassword: hashedPassword,
      },
    };
    try {
      await this.client.send(new PutCommand(params));
    } catch {
      throw new Error("Error adding user");
    }
  }

  public async getUser(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        alias,
      },
    };
    try {
      const result = await this.client.send(new GetCommand(params));
      if (!result.Item) {
        return null;
      }
      return new User(
        result.Item.firstName,
        result.Item.lastName,
        result.Item.alias,
        result.Item.imageUrl,
      );
    } catch (error) {
      throw new Error("Error getting user");
    }
  }

  async getHashedPassword(alias: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        alias: alias,
      },
      ProjectionExpression: "hashedPassword",
    };

    const result = await this.client.send(new GetCommand(params));
    if (result.Item && result.Item.hashedPassword) {
      return result.Item.hashedPassword;
    }
    throw new Error("Missing password hash");
  }
}
