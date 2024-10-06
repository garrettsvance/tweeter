import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./userInfoHook";
import React from "react";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  return { navigateToUser };
};

export default useUserNavigation;
