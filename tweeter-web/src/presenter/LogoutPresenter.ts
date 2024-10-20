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
  private service: UserService | null = null;

  public constructor(view: LogoutView) {
    super(view);
  }

  public get view() {
    return super.view as LogoutView;
  }

  public get userService() {
    if (this.service == null) {
      this.service = new UserService();
    }
    return this.service;
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
