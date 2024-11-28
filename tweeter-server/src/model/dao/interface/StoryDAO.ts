export interface StoryDAO {
  getPageOfStatuses(
    alias: string,
    pageSize: number,
    hasMore: boolean,
  ): Promise<void>;
}
