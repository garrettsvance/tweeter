import { GetIsFollowerRequest, GetIsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getFollowService } from "../utils";

export const handler = async (
  request: GetIsFollowerRequest,
): Promise<GetIsFollowerResponse> => {
  const service = getFollowService();

  const isFollower = await service.getIsFollowerStatus(
    request.authToken,
    request.user,
    request.selectedUser,
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
