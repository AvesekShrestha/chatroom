import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"

const useToken = () => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const data = jwtDecode(token)
            setLoggedIn(true)
            setUser(data)
        }
        else {
            setLoggedIn(false)
            setUser(null)
        }



    }, [])

    return { loggedIn, user };
}

export default useToken;
