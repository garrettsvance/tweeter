import { StatusDto, UserDto } from "tweeter-shared";

export interface FeedDAO {
  getFeed(
    alias: string,
    pageSize: number,
    hasMore?: StatusDto | null,
  ): Promise<[StatusDto[], boolean]>;
  addStatus(user: UserDto, status: StatusDto): Promise<void>;
}
