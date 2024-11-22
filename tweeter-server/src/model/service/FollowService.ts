import { AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { FollowsDAO } from "../dao/interface/FollowsDAO";
import { UserDAO } from "../dao/interface/UserDAO";
import { DAOFactory } from "../dao/factory/DAOFactory";

export class FollowService {
  private factoryDAO: DAOFactory;
  private followDAO: FollowsDAO;
  private userDAO: UserDAO;

  constructor(factoryDAO: DAOFactory) {
    this.factoryDAO = factoryDAO;
    this.userDAO = factoryDAO.getUserDAO();
    this.followDAO = factoryDAO.getFollowsDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = await this.followDAO.getFollowers(
      User.fromDto(lastItem),
      pageSize,
      userAlias,
    );
    return [items, hasMore]; // [items.map((user) => user.dto), hasMore];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = await this.followDAO.getFollowees(
      User.fromDto(lastItem),
      pageSize,
      userAlias,
    );
    return [items, hasMore]; // [items.map((user) => user.dto), hasMore];
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias,
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async getFollowerCount(
    token: string,
    userDto: UserDto,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const followerNum = await this.followDAO.getNumFollower(userDto.alias);
    if (!followerNum || followerNum < 0) {
      throw new Error("Error retrieving number of followers");
    }
    return followerNum;
  }

  public async getFolloweeCount(
    token: string,
    userDto: UserDto,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const followeeNum = await this.followDAO.getNumFollowee(userDto.alias);
    if (!followeeNum || followeeNum < 0) {
      throw new Error("Error retrieving number of followees");
    }
    return followeeNum;
  }

  public async getIsFollowerStatus(
    authToken: AuthTokenDto,
    userDto: UserDto,
    selecteduserDto: UserDto,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    const isFollower = await this.followDAO.getIsFollower(
      userDto.alias,
      selecteduserDto.alias,
    );
    if (!isFollower) {
      throw new Error("Error retrieving isFollower status");
    }
    return isFollower;
  }

  public async follow(
    token: string,
    userToFollow: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    try {
      await this.followDAO.followAction(token, userToFollow.alias);
    } catch (error) {
      throw new Error("Error: Unable to follow user");
    }
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    try {
      await this.followDAO.unfollowAction(token, userToUnfollow.alias);
    } catch (error) {
      throw new Error("Error: Unable to follow user");
    }
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
