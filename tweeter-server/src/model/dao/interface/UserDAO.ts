import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<UserDto | null>;
  addUser(user: UserDto): Promise<UserDto>;
}
