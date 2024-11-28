import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  Status,
  StatusDto,
} from "tweeter-shared";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { StoryDAO } from "../dao/interface/StoryDAO";
import { SessionsDAO } from "../dao/interface/SessionsDAO";

export class StatusService {
  private factoryDAO: DAOFactory;
  private sessionsDAO: SessionsDAO;
  private storyDAO: StoryDAO;

  constructor(factoryDAO: DAOFactory) {
    this.factoryDAO = factoryDAO;
    this.storyDAO = factoryDAO.getStoryDAO();
    this.sessionsDAO = factoryDAO.getSessionsDAO();
  }

  public async loadMoreStoryItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [statuses.map((status) => status.dto), hasMore];
  }

  public async loadMoreFeedItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [statuses.map((status) => status.dto), hasMore];
  }

  public async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
