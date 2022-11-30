import React from "react";
import ReactDOM from "react-dom/client";
import { ChatApp } from "./source";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <ChatApp />
    </Router>
  </React.StrictMode>
);

/**
 * npm i lodash.debounce react-color react-dropzone react-file-utils react-popper sass stream-chat stream-chat-react react-router-dom react-icons
 */
