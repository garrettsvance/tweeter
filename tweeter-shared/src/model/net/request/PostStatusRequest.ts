import { TweeterRequest } from "./TweeterRequest";
import { StatusDto } from "../../dto/StatusDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface PostStatusRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly status: StatusDto;
}
