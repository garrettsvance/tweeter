import { FollowService } from "../../model/service/FollowService";
import { FollowHandler } from "./FollowHandler";
import { FollowRequest, FollowResponse } from "tweeter-shared";
import { getFollowService } from "../utils";

export const handler = async (
  request: FollowRequest,
): Promise<FollowResponse> => {
  const followService = getFollowService();

  return FollowHandler(() =>
    followService.follow(request.token, request.userToFollow),
  );
};
