import { FollowService } from "../../model/service/FollowService";
import { GetFolloweeCountRequest } from "tweeter-shared/src/model/net/request/GetFolloweeCountRequest";
import { GetFolloweeCountResponse } from "tweeter-shared/src/model/net/response/GetFolloweeCountResponse";

export const handler = async (
  request: GetFolloweeCountRequest,
): Promise<GetFolloweeCountResponse> => {
  const service = new FollowService();
  const count = await service.getFolloweeCount(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count,
  };
};
