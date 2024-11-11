import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface RegisterResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly authToken: AuthTokenDto;
}
