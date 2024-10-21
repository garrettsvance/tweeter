import useUserInfo from "../../src/components/userInfo/userInfoHook";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { anything, instance, mock, verify } from "ts-mockito";

jest.mock("../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

const mockUserInstance = "mockUser";
const mockAuthTokenInstance = "mockAuthToken";

describe("PostStatus Component", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  // Test 1
  it("starts with post status and clear buttons disabled", () => {
    const { postStatusButton, clearPostButton } = renderPostStatusGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearPostButton).toBeDisabled();
  });
  // Test 2
  it("both buttons enabled when text field has text", async () => {
    const { postStatusButton, clearPostButton, postStatusTextField, user } =
      renderPostStatusGetElements();

    await user.type(postStatusTextField, "post");
    expect(postStatusButton).toBeEnabled();
    expect(clearPostButton).toBeDisabled();
  });
  // Test 3
  it("both buttons disabled when text field is cleared", async () => {
    const { postStatusButton, clearPostButton, postStatusTextField, user } =
      renderPostStatusGetElements();

    await user.clear(postStatusTextField);
    expect(postStatusButton).toBeDisabled();
    expect(clearPostButton).toBeDisabled();
  });
  // Test 4
  it("post status method called when post status button pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const expectedPost = "post";
    const { postStatusButton, postStatusTextField, user } =
      renderPostStatusGetElements(mockPresenterInstance);
    await user.type(postStatusTextField, "post");
    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(anything(), expectedPost, anything()),
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>,
  );
};

const renderPostStatusGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", {
    name: /Post Status/i,
  });
  const clearPostButton = screen.getByRole("button", { name: /Clear/i });
  const postStatusTextField = screen.getByLabelText("status field");

  return { postStatusButton, clearPostButton, postStatusTextField, user };
};
