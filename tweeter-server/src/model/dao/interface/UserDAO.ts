import { AuthTokenDto, User, UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<UserDto | null>;
  associatePasswordAddUser(user: User, password: string): Promise<void>; //TODO: promise should be dto or string?
  getHashedPassword(alias: string): Promise<string>;
}
