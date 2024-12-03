import { Status } from "tweeter-shared";

export interface StatusDAO {
  createStatus(status: Status): Promise<void>;
}
