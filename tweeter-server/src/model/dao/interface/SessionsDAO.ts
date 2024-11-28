import { AuthToken } from "tweeter-shared";

export interface SessionsDAO {
  createSession(authToken: AuthToken): Promise<void>;
  verifySession(authToken: AuthToken): Promise<boolean>;
}
