import { FollowService } from "../../model/service/FollowService";
import { FollowHandler } from "./FollowHandler";
import { FollowRequest, FollowResponse } from "tweeter-shared";

export const handler = async (
  request: FollowRequest,
): Promise<FollowResponse> => {
  const followService = new FollowService();

  return FollowHandler(() =>
    followService.follow(request.token, request.userToFollow),
  );
};
