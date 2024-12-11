import { StatusDto } from "tweeter-shared";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SqsDAO } from "../interface/SqsDAO";

export class SqsDAOAws implements SqsDAO {
  private client = new SQSClient();
  private statusUrl =
    "https://sqs.us-east-2.amazonaws.com/084828578926/tweeter-status-sqs";
  private feedUrl =
    "https://sqs.us-east-2.amazonaws.com/084828578926/tweeter-feed-sqs";

  public async postStatus(status: StatusDto) {
    const messageBody = JSON.stringify({
      status: status,
    });
    console.log("Sending message");
    await this.sendMessage(messageBody, this.statusUrl);
  }

  public async postToFeed(status: StatusDto, followers: string[]) {
    const messageBody = JSON.stringify({
      status: status,
      followers: followers,
    });
    await this.sendMessage(messageBody, this.feedUrl);
  }

  private async sendMessage(body: string, url: string) {
    const params = {
      DelaySeconds: 10,
      MessageBody: body,
      QueueUrl: url,
    };

    try {
      await this.client.send(new SendMessageCommand(params));
    } catch (err) {
      throw err;
    }
  }
}
