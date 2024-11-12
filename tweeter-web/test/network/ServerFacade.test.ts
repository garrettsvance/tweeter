import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";
import {
  GetFollowerCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  UserDto,
} from "tweeter-shared";

describe("ServerFacade Tests", () => {
  let serverFacade = ServerFacade.getInstance();

  test("Register User", async () => {
    const registerRequest: RegisterRequest = {
      firstName: "Test",
      lastName: "Test",
      alias: "testAlias",
      password: "password",
      userImageBase64: "string",
      imageFileExtension: "string",
      token: "token",
    };

    const [user, authToken] = await serverFacade.register(registerRequest);
    expect(user).toBeDefined();
    expect(user.alias).toBe("testAlias");
    expect(authToken).not.toBeNull();
  });

  test("GetFollowers", async () => {
    const getFollowersRequest: PagedUserItemRequest = {
      token: "token",
      userAlias: "testAlias2",
      pageSize: 10,
      lastItem: null,
    };

    const [users, hasMore] =
      await serverFacade.getFollower(getFollowersRequest);
    expect(users).not.toBeNull();
    expect(typeof hasMore).toBe("boolean");
  });

  test("GetFollowerCount", async () => {
    const userDto: UserDto = {
      firstName: "firstname",
      lastName: "lastname",
      alias: "testAlias3",
      imageUrl: "url.string",
    };
    const getFollowerCountRequest: GetFollowerCountRequest = {
      token: "token",
      user: userDto,
    };

    const followerCount = await serverFacade.getFollowerCount(
      getFollowerCountRequest,
    );
    expect(followerCount).toBeGreaterThanOrEqual(0);
  });
});
