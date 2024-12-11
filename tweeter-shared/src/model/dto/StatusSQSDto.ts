import { StatusDto } from "./StatusDto";

export interface StatusSQSDto {
  readonly Status: StatusDto;
  readonly Followers: string[];
}
