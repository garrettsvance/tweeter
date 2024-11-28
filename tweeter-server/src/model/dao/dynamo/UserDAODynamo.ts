import { UserDAO } from "../interface/UserDAO";
import { User, UserDto } from "tweeter-shared";
import { compare, genSalt, hash } from "bcryptjs";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

export class UserDAODynamo implements UserDAO {
  private readonly tableName = "tweeter-users"; // TODO: figure out if i should just make it all one table for users
  private readonly alias = "alias";
  private readonly password = "password";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async associatePasswordAddUser(
    user: User,
    hashedPassword: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: { S: user.alias },
        firstName: { S: user.firstName },
        lastName: { S: user.lastName },
        imageUrl: { S: user.imageUrl },
        hashedPassword: { S: hashedPassword },
      },
    };
    try {
      await this.client.send(new PutItemCommand(params));
    } catch {
      throw new Error("Error adding user");
    }
  }

  getUser(alias: string): Promise<UserDto | null> {
    return Promise.resolve(undefined);
  } //TODO: promise should be dto or string?

  async getHashedPassword(alias: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        alias: { S: alias },
      },
      ProjectionExpression: "hashedPassword",
    };

    const result = await this.client.send(new GetItemCommand(params));
    if (result.Item && result.Item.hashedPassword?.S) {
      return result.Item.hashedPassword.S;
    }
    throw new Error("Missing password hash");
  }
}
