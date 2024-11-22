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
}
