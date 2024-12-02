import { FollowsDAO } from "../interface/FollowsDAO";
import { User, UserDto } from "tweeter-shared";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FollowsDAODynamo implements FollowsDAO {
  private readonly tableName: string = "tweeter-follows";
  private readonly followerIndex: string = "followerIndex";
  private readonly followeeIndex: string = "followeeIndex";
  private readonly followerName: string = "followerName";
  private readonly followerAlias: string = "followerAlias";
  private readonly followerImage: string = "followerImage";
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

  getFollowees(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]> {
    return Promise.resolve([[], false]);
  }

  public async getFollowers(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]> {
    const params = {
      TableName: this.tableName,
      IndexName: this.followerIndex,
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

  getIsFollower(alias: string, aliasToFollow: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  getNumFollowee(alias: string): Promise<number> {
    return Promise.resolve(0);
  }

  getNumFollower(alias: string): Promise<number> {
    return Promise.resolve(0);
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
