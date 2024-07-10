import { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client"

const socketContext = createContext(null);

export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketProvider = (props) => {

    const socket = useMemo(() => io("http://localhost:5000"), []);

    return (

        <socketContext.Provider value={socket}>
            {props.children}
        </socketContext.Provider>
    )
}

export default socketContext;


