import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, User } from "tweeter-shared";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const user = new User("gar", "ret", "garrett", "empty");
  const post = "postString";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance,
    );
  });
  // Test 1
  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(authToken, post, user);
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).once();
  });
  // Test 2
  it("calls postStatus on the post status service with the correct auth token", async () => {
    await postStatusPresenter.submitPost(authToken, post, user);
    verify(mockStatusService.postStatus(authToken, anything())).once();
  });
  // Test 3
  it("tells the view to clear the last info message and clear user info", async () => {
    await postStatusPresenter.submitPost(authToken, post, user);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.clearPost()).once();
    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post status because of exception: An error occurred",
      ),
    ).never();
  });
  // Test 4
  it("displays an error message and clear last info message when unsuccessful status post", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);
    await postStatusPresenter.submitPost(authToken, post, user);

    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post status because of exception: An error occurred",
      ),
    ).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.clearPost()).never();
  });
});
