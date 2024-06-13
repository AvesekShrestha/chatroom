import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Home from "./page/home";
import Register from "./page/register";
import Message from "./page/message";
import Wrapper from "./page/Wrapper";

const App = () => {
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/message" element={<Message />} />
      </Routes>
    </Wrapper>
  )
};

export default App;
