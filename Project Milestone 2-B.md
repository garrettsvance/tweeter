# **Project Milestone #2 Part B - Remove Code Duplication**

For this milestone you will continue to work on the Tweeter UI. The starting point for this milestone is the code you ended up with after completing milestone 2A.

## Requirements

While modifying your code to a proper layered architecture in milestone 2A, you probably noticed a significant amount of code duplication, especially in your presenter layer. Your task for this assignment is to remove all significant code duplication in the client code. You are to use the following programming techniques to remove code duplication:

- Inheritance (including but not limited to the **template method** pattern)
- Composition/Delegation
- Generic types
- Passing functions as parameters
- React component creation (applicable to the view layer only)
- React Hook creation (applicable to the view layer only)
**Note:** Because of the hooks you already created for milestone 1, you likely will not need to create additional hooks for this milestone, but that is a technique that can be used to eliminate code duplication in the view layer.

## Detailed Instructions
Remove all significant duplication in your code.

### Presenter Layer
Begin by watching this [demo video](https://www.youtube.com/watch?v=_JbvPV4rGeA&feature=youtu.be) that shows you how to remove code duplication in your presenter layer. The video focuses mostly on how to remove duplication from your paged presenters (followees, followers, feed and story), but also shows other areas where duplication exists and needs to be removed.

**Note:** We have improved the starter code since making this video so you will notice some differences between your code and the code shown in the video. The main difference is that the video shows you how to refactor a presenter called FollowingPresenter, but you don't have that presenter because we changed the "Following" functionality to be called "Followee". The demo in the video that shows you how to refactor FollowingPresenter applies to your FolloweePresenter. You probably also have other code differences resulting from differences in how you did milestone 2A, but the video will still demonstrate the techniques you need to use to refactor your presenters.

Follow the instructions in the video to remove the duplication specifically demonstrated in the video, other duplication mentioned in the video but not removed, and any other significant code duplication that exists in your presenter layer (whether mentioned in the video or not).

Here are some (but maybe not all) specific areas of duplication that need to be addressed:

- Every presenter defines a View interface to communicate with it's component or hook. These View interfaces might have
operations in common (e.g., for displaying error messages or displaying informational messages). (hint: create a base View interface)
- Every Presenter contains a reference to its View (hint: inheritance)
- The Presenter classes for the paging views (Feed, Story, Followers, Following) are almost identical, including their View interfaces. Use inheritance and generic types to remove this duplication as demonstrated in the video.
- All presenters follow a common try/catch/display error structure. Use a function with function parameters to eliminate this duplication as demonstrated in the video.
- Login and Register have a common structure for authenticating a user and then instructing the view to navigate somewhere. Use a function with function parameters to eliminate this duplication. The code described here will already be wrapped in a function that is passed as a parameter after you resolve the common try/catch/display error structure. Your de-duplicated authentication logic will end up being a function parameter within a function parameter.
### View Layer
Most of the view layer duplication was eliminated as part of the milestone 1 assignment. However, if you followed the instructions for milestone 2A, you would have created a UserItemScroller as demonstrated in the milestone 2A demo video, and a StatusItemScroller (described but not demonstrated in the milestone 2A video). These components are almost identical. Watch this videoLinks to an external site. for a more detailed description of how to resolve this duplication by replacing the two components with one.

**Note:** We have improved the starter code since making this video so you will notice some differences between your code and the code shown in the video. The explanation for how to do this part of the assignment still applies.

Hint: The video tells you to pass an itemComponentGenerator function as a Prop to the new component. This function takes an item (with a generic type) as a parameter and returns a JSX.Element.

### Passoff
- Pass off your project with a TA by the due date at the end of TA hours (you must be in the pass off queue 1 hour before the end of TA hours to guarantee pass off)
- You can only passoff once.
- If you passoff before the passoff day, you will get an additional 4% of extra credit in this assignment
## Rubric
- (25) Code Duplication
    - (15) Used appropriate deduplication techniques (i.e. template method, generics, functions as parameters, etc.)
    - (10) Code is generally free of duplication

[Link to Canvas Page](https://byu.instructure.com/courses/27157/assignments/965317)