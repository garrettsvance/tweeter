import { LoginPresenter } from "../../src/presenter/LoginPresenter";
import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Login from "../../src/components/authentication/login/Login";
import { MemoryRouter } from "react-router-dom";
import { instance, mock, verify } from "ts-mockito";
library.add(fab);

describe("Login Component", () => {
  // Test 1
  it("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });
  // Test 2
  it("enables sign-in button when both fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();
  });
  // Test 3
  it("disables sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "alias");
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();

    await user.clear(aliasField);
    await user.type(passwordField, "password");
    expect(signInButton).toBeDisabled();
  });
  // Test 4
  it("login method called when sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const url = "/fake.com";
    const alias = "alias";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(url, mockPresenterInstance);
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);
    verify(mockPresenter.doLogin(alias, password, url)).once();
  });
});

const renderLoginAndGetElements = (url: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();
  renderLogin(url, presenter);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login url={originalUrl} presenter={presenter} />
      ) : (
        <Login url={originalUrl} />
      )}
    </MemoryRouter>,
  );
};
