## Part 1: React Components
In part one of this assignment, you will improve the provided Tweeter UI by adding react components. This [demo video](https://www.youtube.com/watch?v=-6Eb7kX6R6w) shows you how to create React components by creating two components for you. After watching the video, you should complete the following steps:

1. Download the tweeter-web-starter Download tweeter-web-starterproject zip file.

2. Unzip the file into a parent directory or your choice.

3. Open the project in VS Code and follow the instructions in the Readme to compile and run the project.

4. Create a StatusItem component (similar to the UserItem component created in the video) to eliminate duplication in the Feed and Story UI.

5. Create an AuthenticationFields component, as described in the video, to remove the duplicate UI logic for displaying the Alias and Password fields in the Login and Register components.

**Note:** When you create the AuthenticationFields component, you will notice a slight difference between register and login. There is an onKeyDown event that calls a different method on login vs, register. You can handle that by passing the function to be called as a prop into the AuthenticationFields component.


6. Create an OAuth component, as described in the video, to remove the OAuth fields from the AuthenticationFormLayout component.

## Part 2: More React Components
In part two of the assignment, you will eliminate additional duplication from the UI by creating an additional React component. This [demo video](https://www.youtube.com/watch?v=a3aNCs-Az5Y&feature=youtu.be) shows you how to create the component by creating a similar one for you. After watching the video, you should eliminate the duplication in FeedScroller and StoryScroller by creating a StatusItemScroller, similar to the UserItemScroller created in the video.

## Part 3: React Hooks
In part three of the assignment, you will improve the provided Tweeter UI by adding react hooks. This [demo video](https://www.youtube.com/watch?v=ccqJH47MMOo&feature=youtu.be) shows you how to create React hooks by creating two hooks for you. After watching the video, you should complete the following steps:

1. Create the userNavigationHook described in the video to eliminate code duplication.

2. Create the userInfoHook described in the video to eliminate component dependencies on the UserInfoContext.
Note: The demo video for this part was created before the video for part 2, so you may notice that the code in this video contains the FollowingScroller and FollowersScroller components which were replaced in the part 2 video with UserItemScroller. We have also made some other code changes and improvements since creating this video, so you may notice some subtle differences in the code you're starting with from the code you see in the video. These differences are small and don't affect the code written in the demo or the code you need to write for the hooks you will create.

## Submission Instructions
- Pass off your project with a TA by the due date before TA's are off for the day (you must be in the pass off queue 1 hour before they are off to guarantee same-day pass off)
- You can only passoff once
- If you passoff before the passoff day, you will get an additional 5% of extra credit for this assignment

[Milestone 1 FAQ](https://byu.instructure.com/courses/27157/assignments/965315)

[Link to Instructions/Grading Rubric](https://byu.instructure.com/courses/27157/assignments/965315)
 