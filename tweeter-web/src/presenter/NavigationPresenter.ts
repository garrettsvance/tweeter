import React from "react";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavigationView extends View {
  setDisplayedUser: (user: User) => void;
}

export class NavigationPresenter extends Presenter<NavigationView> {
  private userService: UserService;

  public constructor(view: NavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken,
    currentUser: User,
    event: React.MouseEvent,
  ) {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
