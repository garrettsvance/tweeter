import {
  AuthToken,
  FakeData,
  GetUserRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade = ServerFacade.getInstance();

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };
    return await this.serverFacade.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBase64: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };
    return await this.serverFacade.register(request);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    const request: GetUserRequest = {
      authToken: authToken.toDto(),
      alias: alias,
    };
    return await this.serverFacade.getUser(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      authToken: authToken.toDto(),
    };
    await this.serverFacade.logout(request);
  }
}
