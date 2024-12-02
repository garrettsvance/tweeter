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
}
