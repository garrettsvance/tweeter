import { FeedDAO } from "../interface/FeedDAO";
import { Status, StatusDto, User, UserDto } from "tweeter-shared";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FeedDAODynamo implements FeedDAO {
  private readonly tableName = "tweeter-feed";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async getFeed(
    alias: string,
    pageSize: number,
    hasMore?: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ExclusiveStartKey: hasMore
        ? {
            alias: alias,
            timestamp: hasMore.timestamp.toString(),
          }
        : undefined,
    };
    const response = await this.client.send(new QueryCommand(params));
    const feed = response.Items
      ? response.Items.map(
          (item) =>
            new Status(
              item.post,
              new User(
                item.firstName,
                item.lastName,
                item.alias,
                item.imageUrl,
              ),
              item.timestamp,
            ).dto,
        )
      : [];
    const hasMoreBool = !!response.LastEvaluatedKey;
    return [feed, hasMoreBool];
  }

  public async addStatus(user: UserDto, status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        status: status.post,
        timestamp: status.timestamp,
      },
    };
    try {
      await this.client.send(new PutCommand(params));
    } catch {
      throw Error("Error adding status");
    }
  }

  public async pullFeed(
    //TODO: find implementations of functions within dynamos, create tables
    user: UserDto,
    userFollowers: string[],
    status: StatusDto,
  ): Promise<void> {
    const feedItems = userFollowers.map((follower) => {
      return {
        alias: follower,
        originalPoster: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        status: status.post,
        timestamp: status.timestamp,
      };
    });
    const request = feedItems.map((item) => ({
      PutRequest: {
        Item: item,
      },
    }));
    const params = {
      RequestItems: {
        [this.tableName]: request,
      },
    };
    try {
      await this.client.send(new BatchWriteCommand(params));
    } catch (error) {
      throw new Error("Error pulling feed");
    }
  }
}
