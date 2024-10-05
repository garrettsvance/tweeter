import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface AuthenticationView {
  authenticated: (user: User, authToken: AuthToken) => void;
  displayErrorMessage: (message: string) => void;
  setLoadingState: (isLoading: boolean) => void;
}

export class AuthenticatePresenter {
  protected userService: UserService;
  private view: AuthenticationView;

  constructor(view: AuthenticationView) {
    this.view = view;
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
}
