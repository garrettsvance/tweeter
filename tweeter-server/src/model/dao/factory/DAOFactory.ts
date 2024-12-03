import { UserDAO } from "../interface/UserDAO";
import { FeedDAO } from "../interface/FeedDAO";
import { FollowsDAO } from "../interface/FollowsDAO";
import { S3DAO } from "../interface/S3DAO";
import { StoryDAO } from "../interface/StoryDAO";
import { SessionsDAO } from "../interface/SessionsDAO";
import { StatusDAO } from "../interface/StatusDAO";

export interface DAOFactory {
  readonly getFeedDAO: () => FeedDAO;
  readonly getFollowsDAO: () => FollowsDAO;
  readonly getS3DAO: () => S3DAO;
  readonly getSessionsDAO: () => SessionsDAO;
  readonly getStoryDAO: () => StoryDAO;
  readonly getUserDAO: () => UserDAO;
  readonly getStatusDAO: () => StatusDAO;
}
