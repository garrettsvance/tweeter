import { Link } from "react-router-dom";
import Post from "../statusitem/Post";
import { Status } from "tweeter-shared";

interface StatusItemProps {
    item: Status;
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const StatusItem: React.FC<StatusItemProps> = ({ item, navigateToUser }) => {
    return (
        <div className="row mb-3 mx-0 px-0 border rounded bg-white">
            <div className="col bg-light mx-0 px-0">
                <div className="container px-0">

                </div>
            </div>
        </div>

    )
}