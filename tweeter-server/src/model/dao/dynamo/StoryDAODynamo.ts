import { StoryDAO } from "../interface/StoryDAO";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, StatusDto, User } from "tweeter-shared";

export class StoryDAODynamo implements StoryDAO {
  private readonly tableName = "tweeter-story";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async getPageOfStatuses(
    alias: string,
    pageSize: number,
    hasMore?: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    console.log(
      `Fetching page of statuses for alias: ${alias}, pageSize: ${pageSize}`,
    );
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey: hasMore
        ? {
            alias: alias,
            timestamp: hasMore.timestamp,
          }
        : undefined,
    };
    try {
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

      console.log(
        `Retrieved ${feed.length} statuses. Has more: ${hasMoreBool}`,
      );
      return [feed, hasMoreBool];
    } catch (error) {
      console.error("Error in getPageOfStatuses:", error);
      throw new Error("Failed to retrieve statuses");
    }
  }
}
