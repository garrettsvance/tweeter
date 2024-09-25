import {UserInfoContext} from "./UserInfoProvider";
import {useContext} from "react";

const useUserInfo = () => useContext(UserInfoContext);

export default useUserInfo;
