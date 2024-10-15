import {
  AuthenticatePresenter,
  AuthenticationView,
} from "./AuthenticatePresenter";

export class LoginPresenter extends AuthenticatePresenter {
  public constructor(view: AuthenticationView) {
    super(view);
  }

  public async doLogin(alias: string, password: string) {
    await this.doAuthentication(
      () => this.userService.login(alias, password),
      "login",
    );
  }
}
