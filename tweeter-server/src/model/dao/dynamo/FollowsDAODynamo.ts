import { FollowsDAO } from "../interface/FollowsDAO";
import { User, UserDto } from "tweeter-shared";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FollowsDAODynamo implements FollowsDAO {
  private readonly tableName: string = "tweeter-follows";
  private readonly followerName: string = "followerName";
  private readonly followerAlias: string = "followerAlias";
  private readonly followerImage: string = "followerImage";
  private readonly followeeName: string = "followeeName";
  private readonly followeeAlias: string = "followeeAlias";
  private readonly followeeImage: string = "followeeImage";
  private readonly indexName: string = "follows-index";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async followAction(follower: string, followee: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        followerAlias: follower,
        followeeAlias: followee,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
    } catch {
      throw new Error("Error following user");
    }
  }

  public async getFollowees(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "#follower = :alias",
      ExpressionAttributeNames: {
        "#follower": this.followerAlias,
      },
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      const followees = response.Items
        ? response.Items.map((item) => {
            const [firstName, lastName] = item[this.followeeName].split(", ");
            return new User(
              firstName,
              lastName,
              item[this.followeeAlias],
              item[this.followeeImage],
            ).dto;
          })
        : [];
      const hasMore = !!response.LastEvaluatedKey;
      return [followees, hasMore];
    } catch {
      throw new Error("Error retrieving followers");
    }
  }

  public async getFollowers(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "#followee = :alias",
      ExpressionAttributeNames: {
        "#followee": this.followeeAlias,
      },
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      const followers = response.Items
        ? response.Items.map((item) => {
            const [firstName, lastName] = item[this.followerName].split(", ");
            return new User(
              firstName,
              lastName,
              item[this.followerAlias],
              item[this.followerImage],
            ).dto;
          })
        : [];
      const hasMore = !!response.LastEvaluatedKey;
      return [followers, hasMore];
    } catch {
      throw new Error("Error retrieving followers");
    }
  }

  //TODO: double check the differences with index and table names, and use that when searching for your information
  // for followers and followees

  public async getIsFollower(
    alias: string,
    aliasToFollow: string,
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression:
        "followerAlias = :alias AND followeeAlias = :aliasToFollow",
      ExpressionAttributeValues: {
        followerAlias: alias,
        followeeAlias: aliasToFollow,
      },
      Limit: 1,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      return !!(response.Items && response.Items.length > 0);
    } catch {
      throw new Error("Error getting isFollower status");
    }
  }

  public async getNumFollowee(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "#follower = :alias",
      ExpressionAttributeNames: {
        "#follower": this.followerAlias,
      },
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Select: "COUNT",
    };
    try {
      const result = await this.client.send(new QueryCommand(params));
      return result.Count ?? 0;
    } catch {
      throw new Error("Error retrieving numFollowee");
    }
  }

  public async getNumFollower(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "followee = :alias",
      ExpressionAttributeNames: {
        "#followee": this.followeeAlias,
      },
      ExpressionAttributeValues: {
        alias: alias,
      },
      Select: "COUNT",
    };
    try {
      const result = await this.client.send(new QueryCommand(params));
      return result.Count ?? 0;
    } catch {
      throw new Error("Error retrieving numFollower");
    }
  }

  public async unfollowAction(
    follower: string,
    followee: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        followerAlias: follower,
        followeeAlias: followee,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
    } catch {
      throw new Error("Error following user");
    }
  }
}
