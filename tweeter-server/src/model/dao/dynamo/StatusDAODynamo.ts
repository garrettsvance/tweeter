import { StatusDAO } from "../interface/StatusDAO";
import { Status } from "tweeter-shared";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class StatusDAODynamo implements StatusDAO {
  private readonly tableName: string = "tweeter-status";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async createStatus(status: Status): Promise<void> {
    const user = status.user;
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
      console.log(
        `Successfully created status: ${status.post} by ${user.alias}`,
      );
    } catch (error) {
      console.error("Error in creating status:", error);
      throw new Error("Error creating status");
    }
  }
}
