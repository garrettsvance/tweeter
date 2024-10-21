import "./PostStatus.css";
import React, { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import userInfoHook from "../userInfo/userInfoHook";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../presenter/PostStatusPresenter";

interface PostStatusProps {
  presenter?: PostStatusPresenter;
}

const PostStatus = (props: PostStatusProps) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();
  const { currentUser, authToken } = userInfoHook();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    clearLastInfoMessage: () => clearLastInfoMessage(),
    displayErrorMessage: (message: string) => displayErrorMessage(message),
    clearPost: () => setPost(""),
    setIsLoading: (loading: boolean) => setIsLoading(loading),
    displayInfoMessage: (message: string, duration: number) =>
      displayInfoMessage(message, duration),
  };

  const presenter = props.presenter ?? new PostStatusPresenter(listener);

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    await presenter.submitPost(authToken!, post, currentUser!);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            id="postStatusTextArea"
            rows={10}
            placeholder="What's on your mind?"
            aria-label="status field"
            value={post}
            onChange={(event) => {
              setPost(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={checkButtonStatus()}
            style={{ width: "8em" }}
            onClick={(event) => submitPost(event)}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
            className="btn btn-md btn-secondary"
            type="button"
            disabled={checkButtonStatus()}
            onClick={(event) => clearPost(event)}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
