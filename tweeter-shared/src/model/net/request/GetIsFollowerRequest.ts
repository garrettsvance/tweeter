import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetIsFollowerRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
