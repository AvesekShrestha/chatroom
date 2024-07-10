import { createContext, useContext, useRef, useState } from "react";
import SimplePeer from "simple-peer";

const PeerContext = createContext(null);

export const usePeer = () => {
    return useContext(PeerContext);
}

export const PeerProvider = (props) => {
    const [callerPeer, setCallerPeer] = useState(null);
    const [receiverPeer, setReceiverPeer] = useState(null);
    const localStream = useRef(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const initializeCall = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStream.current = stream;

                const peer = new SimplePeer({
                    initiator: true,
                    trickle: false,
                    stream
                });

                peer.on("stream", (data) => {
                    setRemoteStream(data);
                });

                peer.on("signal", (data) => {
                    const offer = JSON.stringify(data);
                    resolve({ offer });
                });

                setCallerPeer(peer);
            } catch (error) {
                console.log("Error occurred while initializing call", error);
                reject(error);
            }
        });
    };

    const receiveCall = async (offer) => {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                localStream.current = stream;

                const peer = new SimplePeer({
                    initiator: false,
                    trickle: false,
                    stream
                });

                peer.on("signal", (data) => {
                    const answer = JSON.stringify(data);
                    resolve({ answer });
                });

                peer.on("stream", (data) => {
                    setRemoteStream(data);
                });

                peer.signal(JSON.parse(offer));
                setReceiverPeer(peer);
            } catch (error) {
                reject(error);
            }
        });
    };

    const connect = (answer) => {
        if (callerPeer) {
            callerPeer.signal(JSON.parse(answer));
        }
    };

    return (
        <PeerContext.Provider value={{ initializeCall, receiveCall, connect, localStream, remoteStream }}>
            {props.children}
        </PeerContext.Provider>
    );
};

export default PeerContext;
