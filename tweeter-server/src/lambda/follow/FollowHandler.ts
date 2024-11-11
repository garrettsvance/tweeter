import { TweeterResponse } from "tweeter-shared";

export async function FollowHandler(
  serviceMethod: () => Promise<[number, number]>,
): Promise<TweeterResponse & { followerCount: number; followeeCount: number }> {
  const [followerCount, followeeCount] = await serviceMethod();

  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
}
