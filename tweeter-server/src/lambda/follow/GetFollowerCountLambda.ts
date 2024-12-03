import { FollowService } from "../../model/service/FollowService";
import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
} from "tweeter-shared";
import { getFollowService } from "../utils";

export const handler = async (
  request: GetFollowerCountRequest,
): Promise<GetFollowerCountResponse> => {
  const service = getFollowService();
  const count = await service.getFollowerCount(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count,
  };
};
