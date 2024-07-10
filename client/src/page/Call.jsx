import React, { useEffect, useRef, useState } from "react";
import { FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaUser, FaExpand, FaCompress } from 'react-icons/fa';
import { useSocket } from "../context/socket";
import { usePeer } from "../context/webrtc";
import { useNavigate } from "react-router-dom";

const Call = () => {
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [showLocalVideo, setShowLocalVideo] = useState(true);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socket = useSocket();
    const { localStream, remoteStream, connect } = usePeer();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStream.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream.current;
        }

        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream]);

    useEffect(() => {
        socket.on("call accepted", (data) => {
            const { answer } = data;
            connect(answer);
        });

        return () => {
            socket.off("call accepted");
        };
    }, [socket, connect]);

    const handleAudioToggle = () => {
        const audioTrack = localStream.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setAudio(audioTrack.enabled);
        }
    };

    const handleVideoToggle = () => {
        const videoTrack = localStream.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideo(videoTrack.enabled);
        }
    };

    const handleEndCall = () => {
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
        }
        navigate("/message");
    };

    const handleToggleLocalVideo = () => {
        setShowLocalVideo(!showLocalVideo);
    };

    return (
        <div className="d-flex justify-content-center align-items-center flex-column h-100">
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100vh', objectFit: 'cover' }}></video>

                <div className="position-absolute bottom-0 end-0 d-flex flex-column align-items-end m-3">
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={handleToggleLocalVideo}
                            className="btn btn-light"
                            style={{ position: 'absolute', top: '5px', left: '5px', zIndex: '1', border: 'none', background: 'transparent', color: 'white' }}
                        >
                            {showLocalVideo ? <FaCompress size={25} /> : <FaExpand size={25} />}
                        </button>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: showLocalVideo ? '330px' : '50px',
                                height: showLocalVideo ? '220px' : '50px',
                                objectFit: 'cover',
                                border: '2px solid white',
                                borderRadius: '10px',
                                transition: 'width 0.3s, height 0.3s'
                            }}
                        ></video>
                    </div>
                </div>
            </div>

            <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex justify-content-around align-items-center w-50 px-3 pb-3 bg-light mb-5 rounded" style={{ height: "80px" }}>
                <FaUser size={25} color="grey" cursor={"pointer"} />
                <FaDesktop size={25} color="grey" cursor={"pointer"} />
                {
                    audio ?
                        <FaMicrophone size={25} color="grey" cursor={"pointer"} onClick={handleAudioToggle} />
                        : <FaMicrophoneSlash size={25} color="grey" cursor={"pointer"} onClick={handleAudioToggle} />
                }
                {
                    video ?
                        <FaVideo size={25} color="grey" cursor={"pointer"} onClick={handleVideoToggle} />
                        : <FaVideoSlash size={25} color="grey" cursor={"pointer"} onClick={handleVideoToggle} />
                }
                <FaPhone color="red" cursor="pointer" size={25} onClick={handleEndCall} />
            </div>
        </div>
    );
};

export default Call;
