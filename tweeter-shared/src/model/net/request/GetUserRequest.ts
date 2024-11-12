import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetUserRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly alias: string;
}
