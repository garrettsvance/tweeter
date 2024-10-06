import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./userInfoHook";
import React from "react";
import {
  NavigationPresenter,
  NavigationView,
} from "../../presenter/NavigationPresenter";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: NavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };

  const presenter = new NavigationPresenter(listener);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    await presenter.navigateToUser(authToken!, currentUser!, event);
  };

  return { navigateToUser };
};

export default useUserNavigation;
