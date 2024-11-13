import {
  AuthToken,
  FakeData,
  PagedStatusItemRequest,
  PostStatusRequest,
  Status,
  StatusDto,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import PostStatus from "../../components/postStatus/PostStatus";

export class StatusService {
  private serverFacade = ServerFacade.getInstance();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      authToken: authToken.toDto(),
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    return await this.serverFacade.getMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      authToken: authToken.toDto(),
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    return await this.serverFacade.getMoreFeedItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      authToken: authToken.toDto(),
      status: newStatus.toDto() as StatusDto,
    };
    return await this.serverFacade.postStatus(request);
  }
}
