import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface PagedItemRequest<T> extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: T | null;
}
