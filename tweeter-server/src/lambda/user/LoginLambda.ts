import { UserService } from "../../model/service/UserService";
import { LoginRequest, LoginResponse } from "tweeter-shared";
import { getUserService } from "../utils";

export const handler = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const userService = getUserService();

  const [user, authToken] = await userService.login(
    request.alias,
    request.password,
  );

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
