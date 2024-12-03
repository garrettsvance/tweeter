import { Status, StatusDto } from "tweeter-shared";

export interface StatusDAO {
  createStatus(status: Status): Promise<void>;
  getPageOfStatuses(
    alias: string,
    pageSize: number,
    hasMore?: StatusDto | null,
  ): Promise<[StatusDto[], boolean]>;
}
