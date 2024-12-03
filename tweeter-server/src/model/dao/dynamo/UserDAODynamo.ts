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
    console.log(`Adding user: ${user.alias} to ${this.tableName}`);
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
      console.log(`User ${user.alias} added successfully`);
    } catch (error) {
      console.error(`Error adding user: ${user.alias}`, error);
      throw new Error("Error adding user");
    }
  }

  public async getUser(alias: string): Promise<User | null> {
    console.log(`Fetching user with alias: ${alias}`);
    const params = {
      TableName: this.tableName,
      Key: {
        alias,
      },
    };

    try {
      const result = await this.client.send(new GetCommand(params));
      if (!result.Item) {
        console.log(`User not found: ${alias}`);
        return null;
      }
      console.log(`User ${alias} retrieved successfully`);
      return new User(
        result.Item.firstName,
        result.Item.lastName,
        result.Item.alias,
        result.Item.imageUrl,
      );
    } catch (error) {
      console.error(`Error fetching user with alias: ${alias}`, error);
      throw new Error("Error getting user");
    }
  }

  async getHashedPassword(alias: string): Promise<string> {
    console.log(`Fetching hashed password for alias: ${alias}`);
    const params = {
      TableName: this.tableName,
      Key: {
        alias: alias,
      },
      ProjectionExpression: "hashedPassword",
    };

    try {
      const result = await this.client.send(new GetCommand(params));
      if (result.Item && result.Item.hashedPassword) {
        console.log(`Retrieved hashed password for ${alias}`);
        return result.Item.hashedPassword;
      } else {
        console.log(`Hashed password not found for ${alias}`);
        throw new Error("Missing password hash");
      }
    } catch (error) {
      console.error(
        `Error fetching hashed password for alias: ${alias}`,
        error,
      );
      throw new Error("Error retrieving hashed password");
    }
  }
}
