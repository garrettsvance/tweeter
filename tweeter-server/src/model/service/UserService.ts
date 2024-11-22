import { AuthTokenDto, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { UserDAO } from "../dao/interface/UserDAO";
import { SessionsDAO } from "../dao/interface/SessionsDAO";

export class UserService {
  private factoryDAO: DAOFactory;
  private sessionsDAO: SessionsDAO;
  private userDAO: UserDAO;

  constructor(factoryDAO: DAOFactory) {
    this.factoryDAO = factoryDAO;
    this.userDAO = factoryDAO.getUserDAO();
    this.sessionsDAO = factoryDAO.getSessionsDAO();
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    if (!alias) {
      throw new Error("Alias needed to login");
    }
    if (!password) {
      throw new Error("Password needed to login");
    }
    const pulledAlias = await this.userDAO.getUser(alias);
    const pulledPassword = await this.sessionsDAO.createSesh(alias, password);

    if (!pulledAlias || !pulledPassword) {
      throw new Error("Error in retrieving alias and/or password");
    }

    return [pulledAlias, pulledPassword];
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
    const foundUser = await this.userDAO.getUser(alias);

    if (foundUser) {
      throw new Error("Invalid registration");
    }

    const createdUser: UserDto = new User(
      firstName,
      lastName,
      alias,
      imageStringBase64,
    ).dto; // TODO: check for s3?
    const associatePassword = await this.sessionsDAO.associatePassword(
      alias,
      password,
    );
    const sesh = await this.sessionsDAO.createSesh(alias, password);
    const addedUser = await this.userDAO.addUser(createdUser);
    if (!associatePassword || !sesh || !addedUser) {
      throw new Error("Error registering user (dao)");
    }
    return [addedUser, sesh];
  }

  public async getUser(
    authToken: AuthTokenDto,
    alias: string,
  ): Promise<UserDto | null> {
    const user: UserDto | null = await this.userDAO.getUser(alias);
    if (user === null) {
      console.log("getUser returned null value");
    }
    return user;
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
