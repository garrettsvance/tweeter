import { UserService } from "../../model/service/UserService";
import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { getUserService } from "../utils";

export const handler = async (
  request: LogoutRequest,
): Promise<LogoutResponse> => {
  const userService = getUserService();
  await userService.logout(request.authToken);
  return {
    success: true,
    message: "Logout Successful",
  };
};
