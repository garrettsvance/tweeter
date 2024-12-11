import {
  PostStatusRequest,
  PostStatusResponse,
  StatusDto,
} from "tweeter-shared";
import { getStatusService } from "../utils";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(status: StatusDto): Promise<void> {
  const sqs_url =
    "https://sqs.us-east-2.amazonaws.com/084828578926/tweeter-status-sqs";
  const messageBody = JSON.stringify(status);

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

export const handler = async (
  request: PostStatusRequest,
): Promise<PostStatusResponse> => {
  const service = getStatusService();
  await sendMessage(request.status);
  await service.postStatus(request.authToken, request.status);
  return {
    success: true,
    message: null,
  };
};
