import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {


    const { userAuth: { username },setUserAuth } = useContext(UserContext);
    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({access_token:null})
    }
    return (
        <AnimationWrapper
            
            className="absolute right-0 z-50 "
            transition={{ duration: 0.2 }}
        >
           
            <div className="bg-white absolute right-0 border border-grey w-60  duration-200">
                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <Link to={`/user/${username}`} className="link pl-8 py-4">
                Profile
                </Link>
                <Link to="/dashboard/blogs" className="link pl-8 py-4">
                Dashboard
                </Link>
                <Link to="/settings/edit-profile" className="link pl-8 py-4">
                Settings 
                </Link>
                <span className="absolute border-t border-grey  w-[200%]"></span>
                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4 flex gap-3" onClick={signOutUser}>
                <i className="fi fi-rr-sign-out-alt"></i>
                    <h1 className="font-bold text-l mb-1 text-dark-grey">
                     Sign Out</h1>
                </button>

            </div>
        </AnimationWrapper>

    )
}
export default UserNavigationPanel;