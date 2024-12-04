import { AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { FollowsDAO } from "../dao/interface/FollowsDAO";
import { UserDAO } from "../dao/interface/UserDAO";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { SessionsDAO } from "../dao/interface/SessionsDAO";

export class FollowService {
  private factoryDAO: DAOFactory;
  private followDAO: FollowsDAO;
  private userDAO: UserDAO;
  private sessionDAO: SessionsDAO;

  constructor(factoryDAO: DAOFactory) {
    this.factoryDAO = factoryDAO;
    this.userDAO = factoryDAO.getUserDAO();
    this.followDAO = factoryDAO.getFollowsDAO();
    this.sessionDAO = factoryDAO.getSessionsDAO();
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
    const followerNum = await this.followDAO.getNumFollower(userDto.alias);
    if (!followerNum) {
      throw new Error("Error retrieving number of followers");
    }
    return followerNum;
  }

  public async getFolloweeCount(
    token: string,
    userDto: UserDto,
  ): Promise<number> {
    const followeeNum = await this.followDAO.getNumFollowee(userDto.alias);
    if (!followeeNum) {
      throw new Error("Error retrieving number of followees");
    }
    return followeeNum;
  }

  public async getIsFollowerStatus(
    authToken: AuthTokenDto,
    userDto: UserDto,
    selectedUserDto: UserDto,
  ): Promise<boolean> {
    const isFollower = await this.followDAO.getIsFollower(
      userDto.alias,
      selectedUserDto.alias,
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
    try {
      const alias = await this.sessionDAO.getAliasFromToken(token);
      const userDto = await this.userDAO.getUser(alias);
      const user = User.fromDto(userDto);
      const followUser = User.fromDto(userToFollow);
      if (!user || !followUser) {
        throw new Error(`No user found using alias: ${alias}`);
      }

      await this.followDAO.followAction(user, followUser);
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
