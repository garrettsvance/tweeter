import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  setPost: (post: string) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
  private statusService: StatusService;
  private view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.statusService = new StatusService();
    this.view = view;
  }

  public async submitPost(
    authToken: AuthToken,
    post: string,
    currentUser: User,
  ) {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
