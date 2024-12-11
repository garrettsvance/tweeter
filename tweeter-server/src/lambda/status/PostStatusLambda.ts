import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { getStatusService } from "../utils";

export const handler = async (
  request: PostStatusRequest,
): Promise<PostStatusResponse> => {
  const service = getStatusService();
  await service.postStatus(request.authToken, request.status);
  return {
    success: true,
    message: null,
  };
};
