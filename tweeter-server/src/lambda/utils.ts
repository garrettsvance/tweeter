import { DAOFactoryDynamo } from "../model/dao/dynamo/DAOFactoryDynamo";
import { FollowService } from "../model/service/FollowService";
import { StatusService } from "../model/service/StatusService";
import { UserService } from "../model/service/UserService";

export function getFollowService() {
  return new FollowService(new DAOFactoryDynamo());
}

export function getStatusService() {
  return new StatusService(new DAOFactoryDynamo());
}

export function getUserService() {
  return new UserService(new DAOFactoryDynamo());
}
