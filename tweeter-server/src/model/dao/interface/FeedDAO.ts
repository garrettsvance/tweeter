import { StatusDto, StatusSQSDto, UserDto } from "tweeter-shared";

export interface FeedDAO {
  getFeed(
    alias: string,
    pageSize: number,
    hasMore?: StatusDto | null,
  ): Promise<[StatusDto[], boolean]>;
  createFollowersFeed(
    user: UserDto,
    userFollowers: string[],
    status: StatusDto,
  ): Promise<void>;
  //updateFeed(status: StatusSQSDto): Promise<void>;
  //addStatus(user: UserDto, status: StatusDto): Promise<void>;
}
