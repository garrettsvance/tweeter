import { FollowService } from "../../model/service/FollowService";
import {
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
} from "tweeter-shared";
import { getFollowService } from "../utils";

export const handler = async (
  request: GetFolloweeCountRequest,
): Promise<GetFolloweeCountResponse> => {
  const service = getFollowService();
  const count = await service.getFolloweeCount(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count,
  };
};
