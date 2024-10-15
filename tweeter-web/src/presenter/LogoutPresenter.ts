import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearUserInfo: () => void;
  clearLastInfoMessage: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this.userService = new UserService();
  }

  public async logout(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "logout");
  }
}
