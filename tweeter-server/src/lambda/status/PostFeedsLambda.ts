import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { StatusDto, StatusSQSDto } from "tweeter-shared";
import { getFollowService, getStatusService } from "../utils";

let sqsClient = new SQSClient();

async function addToFeedQueue(sqsStatus: StatusSQSDto): Promise<void> {
  const sqs_url =
    "https://sqs.us-east-2.amazonaws.com/084828578926/tweeter-feed-sqs";

  const messageBody = JSON.stringify(sqsStatus);

  const params = {
    MessageBody: messageBody,
    QueueUrl: sqs_url,
  };

  try {
    await sqsClient.send(new SendMessageCommand(params));
  } catch (err) {
    throw err;
  }
}

export const handler = async function (event: any) {
  const service = getFollowService();

  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const newStatus: StatusDto = JSON.parse(body);
    let hasMoreFollowers = true;
    while (hasMoreFollowers) {
      const followerAliases: string[] = await service.getFollowerAliases(
        newStatus.user.alias,
      );
      let sqsBody: StatusSQSDto = {
        Status: newStatus,
        Followers: followerAliases,
      };
      await addToFeedQueue(sqsBody);
    }
  }
  return null;
};
