import { AuthTokenDto, Status, StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { StoryDAO } from "../dao/interface/StoryDAO";
import { FeedDAO } from "../dao/interface/FeedDAO";
import { StatusDAO } from "../dao/interface/StatusDAO";
import { FollowsDAO } from "../dao/interface/FollowsDAO";

export class StatusService {
  private factoryDAO: DAOFactory;
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private statusDAO: StatusDAO;
  private followsDAO: FollowsDAO;

  constructor(factoryDAO: DAOFactory) {
    this.factoryDAO = factoryDAO;
    this.storyDAO = factoryDAO.getStoryDAO();
    this.feedDAO = factoryDAO.getFeedDAO();
    this.statusDAO = factoryDAO.getStatusDAO();
    this.followsDAO = factoryDAO.getFollowsDAO();
  }

  public async loadMoreStoryItems(
    authToken: AuthTokenDto,
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return await this.storyDAO.getPageOfStatuses(alias, pageSize, lastItem);
  }

  public async loadMoreFeedItems(
    authToken: AuthTokenDto,
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return await this.feedDAO.getFeed(alias, pageSize, lastItem);
  }

  public async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto,
  ): Promise<void> {
    const status = Status.fromDto(newStatus);
    if (!status) {
      throw new Error("Status returned null");
    }
    const userAlias = newStatus.user;
    try {
      await this.statusDAO.createStatus(status);
      const followers = await this.followsDAO.getFollowerAliases(
        userAlias.alias,
      );
      if (followers.length > 0) {
        await this.feedDAO.createFollowersFeed(userAlias, followers, newStatus);
      }
    } catch (error) {
      console.error("Error posting status", error);
    }
  }
}
