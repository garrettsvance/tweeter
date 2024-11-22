import { User, UserDto } from "tweeter-shared";

export interface FollowsDAO {
  getFollowers(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]>;

  getFollowees(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]>;

  getNumFollower(alias: string): Promise<number>;
  getNumFollowee(alias: string): Promise<number>;

  getIsFollower(alias: string, aliasToFollow: string): Promise<boolean>;

  followAction(token: string, userToFollow: string): Promise<void>;
  unfollowAction(token: string, userToUnfollow: string): Promise<void>;
}
