import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface LogoutRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
}
