import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import { UserService } from "../../src/model/service/UserService";
import { AuthToken } from "tweeter-shared";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("LogoutPresenter", () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(
      mockAppNavbarPresenterView,
    );

    const logoutPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarPresenterViewInstance),
    );

    appNavbarPresenter = instance(logoutPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(logoutPresenterSpy.service).thenReturn(mockUserServiceInstance);
  });
  // Test 1
  it("tells the view to display the logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(
      mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });
  // Test 2
  it("calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });
  // Test 3
  it("tells the view to clear the last info message and clear the user info when logout successful", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();
    verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
  });
  // Test 4
  it("displays an error message and does not clear the last info message or clear the user info when logout fails", async () => {
    const error = new Error("An error occurred when logging out");
    when(mockUserService.logout(authToken)).thenThrow(error);
    await appNavbarPresenter.logOut(authToken);

    verify(
      mockAppNavbarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: An error occurred when logging out`,
      ),
    ).once();
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
  });
});
