import { UserService } from "../../model/service/UserService";
import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { getUserService } from "../utils";

export const handler = async (
  request: GetUserRequest,
): Promise<GetUserResponse> => {
  const userService = getUserService();
  const userDto = await userService.getUser(request.authToken, request.alias);

  return {
    success: true,
    message: null,
    user: userDto,
  };
};
