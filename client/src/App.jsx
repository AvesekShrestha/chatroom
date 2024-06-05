import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Home from "./page/home";
import Register from "./page/register";
import Message from "./page/message";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUserData } from "./store/action/userAction";
import Wrapper from "./page/Wrapper";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const data = localStorage.getItem("token");

    if (data) {
      const user = jwtDecode(data);
      const { id, userName, email } = user
      dispatch(setUserData({ id, userName, email }));
    } else {
      dispatch(setUserData(null));
    }

  }, []);

  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/message" element={<Message />} />
      </Routes>
    </Wrapper>
  );
};

export default App;
