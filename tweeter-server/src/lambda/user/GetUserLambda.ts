import { UserService } from "../../model/service/UserService";
import { GetUserRequest, GetUserResponse } from "tweeter-shared";

export const handler = async (
  request: GetUserRequest,
): Promise<GetUserResponse> => {
  const userService = new UserService();
  const userDto = await userService.getUser(request.authToken, request.alias);

  return {
    success: true,
    message: null,
    user: userDto,
  };
};
