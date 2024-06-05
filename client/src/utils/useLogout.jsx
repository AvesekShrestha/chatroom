import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/action/userAction";

const useLogout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logout = () => {
        localStorage.removeItem("token")
        dispatch(setUserData(null));
        navigate("/login");
    }
    return logout;
}

export default useLogout;
