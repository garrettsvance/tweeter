import { UserService } from "../../model/service/UserService";
import { LogoutRequest, LogoutResponse } from "tweeter-shared";

export const handler = async (
  request: LogoutRequest,
): Promise<LogoutResponse> => {
  const userService = new UserService();
  await userService.logout(request.authToken);
  return {
    success: true,
    message: "Logout Successful",
  };
};
