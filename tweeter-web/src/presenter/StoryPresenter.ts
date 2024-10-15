import { StatusItemPresenter } from "./StatusItemPresenter";
import { AuthToken, Status } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  public async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
    );
  }
  protected getItemDescription(): string {
    return "load story items";
  }
}
