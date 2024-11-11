import { FollowService } from "../../model/service/FollowService";
import {
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
} from "tweeter-shared";

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
