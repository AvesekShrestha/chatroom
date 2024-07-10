import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Home from "./page/home";
import Register from "./page/register";
import Message from "./page/message";
import Wrapper from "./page/Wrapper";
import Call from "./page/Call";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "./context/socket";


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const socket = useSocket()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      setUser(user);
      socket?.emit("setup", user);
    }
  }, [loggedIn]);


  return (

    <Wrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register setLoggedIn={setLoggedIn} />} />
        <Route
          path="/message"
          element={<Message />}
        />
        <Route path="/call" element={<Call />} />
      </Routes>
    </Wrapper>
  );
};

export default App;
