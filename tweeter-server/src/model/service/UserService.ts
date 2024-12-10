import { AuthToken, AuthTokenDto, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { UserDAO } from "../dao/interface/UserDAO";
import { SessionsDAO } from "../dao/interface/SessionsDAO";
import bcrypt from "bcryptjs";
import { S3DAO } from "../dao/interface/S3DAO";
import { FollowsDAO } from "../dao/interface/FollowsDAO";

export class UserService {
  private factoryDAO: DAOFactory;
  private sessionsDAO: SessionsDAO;
  private userDAO: UserDAO;
  private s3DAO: S3DAO;
  private followsDAO: FollowsDAO;

  constructor(factoryDAO: DAOFactory) {
    this.factoryDAO = factoryDAO;
    this.userDAO = factoryDAO.getUserDAO();
    this.sessionsDAO = factoryDAO.getSessionsDAO();
    this.s3DAO = factoryDAO.getS3DAO();
    this.followsDAO = factoryDAO.getFollowsDAO();
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
    const pulledUser = await this.userDAO.getUser(alias);

    if (!pulledUser) {
      throw new Error("Error in retrieving alias and/or password");
    }

    await this.validateUser(alias, password);
    const tokenDto = await this.createSesh(pulledUser);

    return [pulledUser, tokenDto];
  }

  public async createSesh(user: UserDto): Promise<AuthTokenDto> {
    const authToken = AuthToken.Generate();
    await this.sessionsDAO.createSession(authToken, user);
    return authToken.toDto();
  }

  public async validateUser(alias: string, password: string): Promise<boolean> {
    const passwordHash = await this.userDAO.getHashedPassword(alias);
    const validated = await bcrypt.compare(password, passwordHash);
    if (!validated) {
      throw new Error("Unable to validate user");
    }
    return validated;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    if (await this.userDAO.getUser(alias)) {
      throw new Error("User already exists");
    }

    const normalizedExtension = imageFileExtension.toLowerCase();
    const allowedExtensions = new Set(["jpg", "jpeg", "png"]);
    if (!allowedExtensions.has(normalizedExtension)) {
      throw new Error(
        `Invalid file type for profile picture: ${normalizedExtension}`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const bufferedImage = Buffer.from(userImageBytes).toString("base64");

    const imageUrl = await this.s3DAO.putImage(
      alias,
      bufferedImage,
      imageFileExtension,
    );

    const createdUser = new User(firstName, lastName, alias, imageUrl);
    try {
      await this.userDAO.associatePasswordAddUser(createdUser, hashedPassword);
      //await this.followsDAO.initializeUser(alias);
    } catch {
      throw new Error("Unable to add user");
    }
    const tokenDto = await this.createSesh(createdUser.toDto());

    return [createdUser.toDto(), tokenDto];
  }

  public async getUser(
    authToken: AuthTokenDto,
    alias: string,
  ): Promise<UserDto | null> {
    const tokenCheck = await this.sessionsDAO.verifySession(authToken);
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
