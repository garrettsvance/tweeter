import { AuthTokenDto } from "tweeter-shared";

export interface SessionsDAO {
  createSesh(alias: string, password: string): Promise<AuthTokenDto | null>;
  associatePassword(alias: string, password: string): Promise<string | null>; //TODO: promise should be dto or string?
}
