import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getFollowService } from "../utils";

export const handler = async (
  request: PagedUserItemRequest,
): Promise<PagedUserItemResponse> => {
  const followService = getFollowService();
  const [items, hasMore] = await followService.loadMoreFollowers(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem,
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
