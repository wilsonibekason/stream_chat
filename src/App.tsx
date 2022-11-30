import React, { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat, enTranslations, Streami18n } from "stream-chat-react";
import { getRandomImage } from "./assets";
import { useChecklist } from "./CheckListTacks";
import type { StreamChatType } from "./types/types";
import { WorkspaceController } from "./services/context/WorkspaceController";
import Cookies from "universal-cookie";

const cookies = new Cookies();

import "stream-chat-react/disk/css/index.css";

const urlParams = new URLSearchParams(window.location.search);

const apiKey = urlParams.get("apikey") || process.env.REACT_APP_STREAM_KEY;

const user = urlParams.get("user") || process.env.REACT_APP_USER_ID;

const theme = urlParams.get("theme") || "light";

export const userToken =
  urlParams.get("user_token") || process.env.REACT_APP_USER_TOKEN;

const targetOrigin =
  urlParams.get("target_origin") || process.env.REACT_APP_TARGET_ORIGIN;

export const authToken = cookies.get("token");
interface NewStreamChatType extends StreamChatType {
  fullName: string;
}
const client = StreamChat.getInstance(apiKey!, {
  enableInsights: true,
  enableWSFallback: true,
});

if (authToken) {
  client.connectUser(
    {
      id: cookies.get("userId"),
      name: cookies.get("username"),
      email: cookies.get("email"),
      hashedPassword: cookies.get("hashedPassword"),
      phoneNumber: cookies.get("phoneNumber"),
      fullName: cookies.get("fullName"),
      image: getRandomImage() as string,
    },
    authToken
  );
}
// client.connectUser({ id: user!, name: user, image: getRandomImage() }, userToken);

const ii8nInstance = new Streami18n({
  language: "en",
  translationsForLanguage: {
    ...enTranslations,
  },
});

const App = () => {
  useChecklist({ chatClient: client, targetOrigin: targetOrigin! });

  useEffect(() => {
    const handleColorChange = (color: string) => {
      const root = document.documentElement;
      if (color.length && color.length === 7) {
        root.style.setProperty("..primary", `${color}E6`);
        root.style.setProperty("--primary-color-alpha", `${color}1A`);
      }
    };
    window.addEventListener("message", (event) =>
      handleColorChange(event.data)
    );
    return () => {
      client.disconnectUser();
      window.removeEventListener("message", (event) =>
        handleColorChange(event.data)
      );
    };
  }, []);
  return (
    <>
      <div className={`app_wrapper str-chat`}>
        <Chat {...{ client, ii8nInstance }} theme={`team ${theme}`}>
          <WorkspaceController>
            <Sidebar />
            <ChannelContainer />
          </WorkspaceController>
        </Chat>
      </div>
    </>
  );
};

export default App;
