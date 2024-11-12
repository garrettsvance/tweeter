import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest,
): Promise<PostStatusResponse> => {
  const service = new StatusService();
  await service.postStatus(request.authToken, request.status);
  return {
    success: true,
    message: null,
  };
};
