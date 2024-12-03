import { FollowService } from "../../model/service/FollowService";
import { FollowHandler } from "./FollowHandler";
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { getFollowService } from "../utils";

export const handler = async (
  request: UnfollowRequest,
): Promise<UnfollowResponse> => {
  const followService = getFollowService();

  return FollowHandler(() =>
    followService.unfollow(request.token, request.userToUnfollow),
  );
};
