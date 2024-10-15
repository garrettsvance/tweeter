import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  setPost: (post: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
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
