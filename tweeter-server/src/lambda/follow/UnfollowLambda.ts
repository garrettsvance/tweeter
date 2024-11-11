import { FollowService } from "../../model/service/FollowService";
import { FollowHandler } from "./FollowHandler";
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";

export const handler = async (
  request: UnfollowRequest,
): Promise<UnfollowResponse> => {
  const followService = new FollowService();

  return FollowHandler(() =>
    followService.unfollow(request.token, request.userToUnfollow),
  );
};
