import { UserService } from "../../model/service/UserService";
import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { getUserService } from "../utils";

export const handler = async (
  request: RegisterRequest,
): Promise<RegisterResponse> => {
  const userService = getUserService();
  const userImageBytes = Buffer.from(request.userImageBase64, "base64");
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    userImageBytes,
    request.imageFileExtension,
  );

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
