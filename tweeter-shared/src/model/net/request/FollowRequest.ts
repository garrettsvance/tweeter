import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";

export interface FollowRequest extends TweeterRequest {
  readonly userToFollow: UserDto;
}
