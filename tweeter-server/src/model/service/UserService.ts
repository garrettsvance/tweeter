import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.toDto(), FakeData.instance.authToken.toDto()];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    // Not needed now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.toDto(), FakeData.instance.authToken.toDto()];
  }

  public async getUser(
    authToken: AuthTokenDto,
    alias: string,
  ): Promise<UserDto | null> {
    const user: User | null = FakeData.instance.findUserByAlias(alias);
    return user ? user.toDto() : null;
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
