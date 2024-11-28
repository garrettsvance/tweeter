import { AuthToken, AuthTokenDto } from "tweeter-shared";

export interface SessionsDAO {
  createSession(authToken: AuthToken): Promise<void>;
  verifySession(authToken: AuthTokenDto): Promise<boolean>;
}
