import { DAOFactory } from "../factory/DAOFactory";
import { FeedDAO } from "../interface/FeedDAO";
import { FollowsDAO } from "../interface/FollowsDAO";
import { S3DAO } from "../interface/S3DAO";
import { SessionsDAO } from "../interface/SessionsDAO";
import { UserDAODynamo } from "./UserDAODynamo";
import { SessionsDAODynamo } from "./SessionsDAODynamo";
import { FeedDAODynamo } from "./FeedDAODynamo";
import { FollowsDAODynamo } from "./FollowsDAODynamo";
import { S3DAODynamo } from "./S3DAODynamo";
import { StatusDAO } from "../interface/StatusDAO";
import { StatusDAODynamo } from "./StatusDAODynamo";

export class DAOFactoryDynamo implements DAOFactory {
  public getUserDAO() {
    return new UserDAODynamo();
  }

  public getFeedDAO(): FeedDAO {
    return new FeedDAODynamo();
  }

  public getFollowsDAO(): FollowsDAO {
    return new FollowsDAODynamo();
  }

  public getS3DAO(): S3DAO {
    return new S3DAODynamo();
  }

  public getSessionsDAO(): SessionsDAO {
    return new SessionsDAODynamo();
  }

  public getStatusDAO(): StatusDAO {
    return new StatusDAODynamo();
  }
}
