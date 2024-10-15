import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, StatusView } from "./Presenter";

export interface UserInfoView extends StatusView {
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsFollower: (isFollower: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
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
    await this.doFailureReportingOperation(async () => {
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
    }, "set follow status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser),
      );
    }, "set follower count");
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${userToFollow.name}...`, 2000);

      let [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        userToFollow!,
      );
      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
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
    }, "unfollow displayed user");
  }
}
