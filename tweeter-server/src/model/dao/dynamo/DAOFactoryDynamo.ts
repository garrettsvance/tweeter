import {DAOFactory} from "../factory/DAOFactory";
import {FeedDAO} from "../interface/FeedDAO";
import {FollowsDAO} from "../interface/FollowsDAO";
import {S3DAO} from "../interface/S3DAO";
import {SessionsDAO} from "../interface/SessionsDAO";
import {StoryDAO} from "../interface/StoryDAO";
import {UserDAODynamo} from "./UserDAODynamo";
import {SessionsDAODynamo} from "./SessionsDAODynamo";

export class DAOFactoryDynamo implements DAOFactory {
    public getUserDAO() {
        return new UserDAODynamo();
    }

    readonly getFeedDAO(): FeedDAO {
        return undefined;
    }

    readonly getFollowsDAO(): FollowsDAO {
        return undefined;
    }

    readonly getS3DAO(): S3DAO {
        return undefined;
    }

    public getSessionsDAO(): SessionsDAO {
        return new SessionsDAODynamo();
    }

    readonly getStoryDAO(): StoryDAO {
        return undefined;
    }

}