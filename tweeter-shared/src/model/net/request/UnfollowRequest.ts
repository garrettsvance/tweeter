import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";

export interface UnfollowRequest extends TweeterRequest {
  readonly token: string;
  readonly userToUnfollow: UserDto;
}
