import { StatusDto } from "tweeter-shared";

export interface StoryDAO {
  getPageOfStatuses(
    alias: string,
    pageSize: number,
    hasMore?: StatusDto | null,
  ): Promise<[StatusDto[], boolean]>;
}
