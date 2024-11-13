import "isomorphic-fetch";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken } from "tweeter-shared";

describe("StatusService test", () => {
  const statusService = new StatusService();

  test("Return a user's story pages", async () => {
    const authToken = new AuthToken("string", Date.now());
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "Alias",
      10,
      null,
    );
    expect(statuses).not.toBeNull();
    expect(typeof hasMore).toBe("boolean");
  });
});
