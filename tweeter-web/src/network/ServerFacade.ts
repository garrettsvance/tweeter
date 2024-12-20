import { ClientCommunicator } from "./ClientCommunicator";
import {
  AuthToken,
  AuthTokenDto,
  FollowRequest,
  FollowResponse,
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
  GetFollowerCountRequest,
  GetFollowerCountResponse,
  GetIsFollowerRequest,
  GetIsFollowerResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  UnfollowRequest,
  UnfollowResponse,
  User,
  UserDto,
} from "tweeter-shared";

export class ServerFacade {
  private static instance: ServerFacade;
  private SERVER_URL =
    "https://8g1uyx0lqk.execute-api.us-east-2.amazonaws.com/dev";
  private clientCommunicator: ClientCommunicator;

  private constructor() {
    this.clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  }

  public static getInstance(): ServerFacade {
    if (!ServerFacade.instance) {
      ServerFacade.instance = new ServerFacade();
    }
    return ServerFacade.instance;
  }

  public async getFollowee(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    if (items === null) {
      throw new Error(
        `No followees found for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    } else {
      return [items, response.hasMore];
    }
  }

  public async getFollower(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    if (items === null) {
      throw new Error(
        `No followers found for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    } else {
      return [items, response.hasMore];
    }
  }

  public async getFolloweeCount(
    request: GetFolloweeCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFolloweeCountRequest,
      GetFolloweeCountResponse
    >(request, "/followee/count");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(
        `Failed to get followee count for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async getFollowerCount(
    request: GetFollowerCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowerCountRequest,
      GetFollowerCountResponse
    >(request, "/follower/count");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(
        `Failed to get follower count for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(
        `Failed to follow user for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async unfollow(request: UnfollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UnfollowResponse
    >(request, "/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(
        `Failed to unfollow user for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/login");

    if (response.success) {
      const user = User.fromDto(response.user as UserDto);
      const authToken = AuthToken.fromDto(response.authToken as AuthTokenDto);
      return [user as User, authToken as AuthToken];
    } else {
      throw new Error(
        `Login failed for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/logout");

    if (!response.success) {
      throw new Error(
        `Logout failed for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/register");

    if (response.success) {
      const user = User.fromDto(response.user as UserDto);
      const authToken = AuthToken.fromDto(response.authToken as AuthTokenDto);
      return [user as User, authToken as AuthToken];
    } else {
      throw new Error(
        `Registration failed for request: ${JSON.stringify(request.alias)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/getUser");

    if (response.success) {
      return response.user ? User.fromDto(response.user as UserDto) : null;
    } else {
      throw new Error(
        `Failed to get user for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error(
          `No story items found for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
            response,
          )}`,
        );
      } else {
        return [items, response.hasMore];
      }
    } else {
      throw new Error(
        `Failed to get story items for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error(
          `No feed items found for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
            response,
          )}`,
        );
      } else {
        return [items, response.hasMore];
      }
    } else {
      throw new Error(
        `Failed to get feed items for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/post");
    if (!response.success) {
      throw new Error(
        `Failed to post status for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }

  public async getIsFollower(request: GetIsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerRequest,
      GetIsFollowerResponse
    >(request, "/follower/status");

    if (response.success) {
      return response.isFollower;
    } else {
      throw new Error(
        `Failed to check follower status for request: ${JSON.stringify(request)}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  }
}
