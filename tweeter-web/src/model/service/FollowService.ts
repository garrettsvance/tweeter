import {
  AuthToken,
  FakeData,
  FollowRequest,
  GetFolloweeCountRequest,
  GetFollowerCountRequest,
  GetIsFollowerRequest,
  PagedUserItemRequest,
  UnfollowRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade = ServerFacade.getInstance();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    return await this.serverFacade.getFollower(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    return await this.serverFacade.getFollowee(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: GetFollowerCountRequest = {
      token: authToken.token,
      user: user.toDto(),
    };
    return await this.serverFacade.getFollowerCount(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: GetFolloweeCountRequest = {
      token: authToken.token,
      user: user.toDto(),
    };
    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const request: GetIsFollowerRequest = {
      token: authToken.token, // TODO: if running into issues, maybe here?
      authToken: authToken.toDto(),
      user: user.toDto(),
      selectedUser: selectedUser.toDto(),
    };
    return await this.serverFacade.getIsFollower(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      userToFollow: userToFollow.toDto(),
    };
    return await this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: UnfollowRequest = {
      token: authToken.token,
      userToUnfollow: userToUnfollow.toDto(),
    };
    return await this.serverFacade.unfollow(request);
  }
}
