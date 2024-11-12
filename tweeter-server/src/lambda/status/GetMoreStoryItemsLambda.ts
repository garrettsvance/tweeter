import { StatusService } from "../../model/service/StatusService";
import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";

export const handler = async (
  request: PagedStatusItemRequest,
): Promise<PagedStatusItemResponse> => {
  const service = new StatusService();
  const [items, hasMore] = await service.loadMoreStoryItems(
    request.authToken,
    request.userAlias,
    request.pageSize,
    request.lastItem,
  );
  return {
    success: true,
    message: null,
    items,
    hasMore,
  };
};
