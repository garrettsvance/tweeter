import { FollowService } from "../../model/service/FollowService";
import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
} from "tweeter-shared";

export const handler = async (
  request: GetFollowerCountRequest,
): Promise<GetFollowerCountResponse> => {
  const service = new FollowService();
  const count = await service.getFollowerCount(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count,
  };
};
