import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsFollower: (isFollower: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;
  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`,
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser),
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${userToFollow.name}...`, 2000);

      let [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        userToFollow!,
      );
      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this.view.clearLastInfoMessage;
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `Unfollowing ${userToUnfollow.name}...`,
        2000,
      );

      let [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        userToUnfollow!,
      );
      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this.view.clearLastInfoMessage;
      this.view.setIsLoading(false);
    }
  }
}
