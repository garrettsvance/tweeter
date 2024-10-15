import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  authenticated: (user: User, authToken: AuthToken) => void;
  setLoadingState: (isLoading: boolean) => void;
}

export class AuthenticatePresenter extends Presenter<AuthenticationView> {
  protected userService: UserService;

  constructor(view: AuthenticationView) {
    super(view);
    this.userService = new UserService();
  }

  protected authenticated(user: User, authToken: AuthToken) {
    this.view.authenticated(user, authToken);
  }

  protected displayErrorMessage(message: string) {
    this.view.displayErrorMessage(message);
  }

  protected setLoadingState(state: boolean) {
    this.view.setLoadingState(state);
  }

  protected async doAuthentication(
    authentication: () => Promise<[User, AuthToken]>,
    operationDescription: string,
  ) {
    this.setLoadingState(true);
    try {
      const [user, authToken] = await authentication();
      this.authenticated(user, authToken);
    } catch (error) {
      this.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`,
      );
    } finally {
      this.setLoadingState(false);
    }
  }
}
