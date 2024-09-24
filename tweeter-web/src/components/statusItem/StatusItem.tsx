import { Link } from "react-router-dom";
import Post from "./Post";
import { Status } from "tweeter-shared";
import React, {useContext} from "react";
import useToastListener from "../toaster/ToastListenerHook";
import {UserInfoContext} from "../userInfo/UserInfoProvider";

interface Props {
    item: Status;

}

const StatusItem = (props: Props) => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
        useContext(UserInfoContext);
    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

    return (
        <div className="row mb-3 mx-0 px-0 border rounded bg-white">
            <div className="col bg-light mx-0 px-0">
                <div className="container px-0">
                    <div className="row mx-0 px-0">
                        <div className="col-auto p-3">
                            <img
                            src={props.item.user.imageUrl}
                            className="img-fluid"
                            width="80"
                            alt="Posting user"
                            />
                        </div>
                        <div className="col">
                            <h2>
                                <b>
                                    {props.item.user.firstName} {props.item.user.lastName}
                                </b>{" "}
                                -{" "}
                                <Link
                                    to={props.item.user.alias}
                                    onClick={(event) => navigateToUser(event)}
                                >
                                    {props.item.user.alias}
                                </Link>
                            </h2>
                            {props.item.formattedDate}
                            <br />
                            <Post status={props.item} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusItem;