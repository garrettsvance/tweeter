import { StatusSQSDto } from "tweeter-shared";
import { getStatusService } from "../utils";

export const handler = async function (event: any) {
  const statusService = getStatusService();

  for (let i = 0; i < event.Records.length; ++i) {
    const startTime = Date.now();

    const { body } = event.Records[i];
    const feedUpdate: StatusSQSDto = JSON.parse(body);

    const followerChunks = [];
    for (let i = 0; i < feedUpdate.Followers.length; i += 25) {
      followerChunks.push(feedUpdate.Followers.slice(i, i + 25));
    }

    for (const followerChunk of followerChunks) {
      await statusService.createFollowersFeed(
        feedUpdate.Status.user,
        followerChunk,
        feedUpdate.Status,
      );
    }

    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1000 - elapsedTime),
      );
    }
  }
  return null;
};
