import { FeedDAO } from "../interface/FeedDAO";
import { Status, StatusDto, User, UserDto } from "tweeter-shared";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
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
    console.log(`Fetching feed for alias: ${alias}`);
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
    try {
      const response = await this.client.send(new QueryCommand(params));
      const feed = response.Items
        ? response.Items.map(
            (item) =>
              new Status(
                item.status,
                new User(
                  item.firstName,
                  item.lastName,
                  item.originalPoster,
                  item.imageUrl,
                ),
                item.timestamp,
              ).dto,
          )
        : [];
      const hasMoreBool = !!response.LastEvaluatedKey;
      console.log(
        `Retrieved ${feed.length} feed items. Has more: ${hasMoreBool}`,
      );
      return [feed, hasMoreBool];
    } catch (error) {
      console.error("Error in getFeed:", error);
      throw new Error("Failed to retrieve feed");
    }
  }

  public async createFollowersFeed(
    user: UserDto,
    userFollowers: string[],
    status: StatusDto,
  ): Promise<void> {
    console.log(
      `Pulling feed for ${userFollowers.length} followers of user: ${user.alias}`,
    );
    const feedItems = userFollowers.map((follower) => ({
      alias: follower,
      timestamp: status.timestamp,
      originalPoster: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      status: status.post,
    }));

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
      console.log("Feed pulled successfully");
    } catch (error) {
      console.error("Error in pullFeed:", error);
      throw new Error("Failed to pull feed");
    }
  }

  // public async addStatus(user: UserDto, status: StatusDto): Promise<void> {
  //   console.log(`Adding status for user: ${user.alias}`);
  //   const params = {
  //     TableName: this.tableName,
  //     Item: {
  //       alias: user.alias,
  //       timestamp: status.timestamp,
  //       author: user.alias,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       imageUrl: user.imageUrl,
  //       status: status.post,
  //     },
  //   };
  //   try {
  //     await this.client.send(new PutCommand(params));
  //     console.log("Status added successfully");
  //   } catch (error) {
  //     console.error("Error in addStatus:", error);
  //     throw new Error("Failed to add status");
  //   }
  // }
}
