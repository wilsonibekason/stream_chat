import * as React from "react";
import App, { userToken, authToken } from "../App";
import { Routes, Route } from "react-router-dom";

const ChatApp = () => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<App />} />
        <Route path={"/login"} element={<></>} />
      </Routes>
    </>
  );
};

export default ChatApp;
