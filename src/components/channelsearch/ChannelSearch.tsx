import * as React from "react";

import { ChannelList } from "stream-chat-react";
import { Channel, UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import _debounce from "lodash.debounce";

import { channelByUser, ChannelOrUserType, isChannel } from "./utils";
import { ResultsDropdown } from "./ResultsDropdown";

import { SearchIcon } from "../../assets";

import type { StreamChatType } from "../../types/types";

export const ChannelSearch = () => {
  const { client, setActiveChannel } = useChatContext<StreamChatType>();

  const [allChannels, setAllChannels] = React.useState<
    UserResponse<StreamChatType>[] | undefined
  >();
  const [teamChannels, setTeamChannels] = React.useState<
    Channel<StreamChatType>[] | undefined
  >();
  const [directChannels, setDirectChannels] = React.useState<
    UserResponse<StreamChatType>[] | undefined
  >();

  const [focused, setFocused] = React.useState<number>();
  const [focusedId, setFocusedId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === allChannels.length - 1 ? 0 : prevFocused + 1;
        });
      } else if (event.key === "ArrowUp") {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === 0 ? allChannels.length - 1 : prevFocused - 1;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();

        if (allChannels !== undefined && focused !== undefined) {
          const channelToCheck = allChannels[focused];

          if (isChannel(channelToCheck)) {
            setActiveChannel(channelToCheck);
          } else {
            channelByUser({
              client,
              setActiveChannel,
              user: channelToCheck,
            });
          }
        }

        setFocused(undefined);
        setFocusedId("");
        setQuery("");
      }
    },
    [allChannels, client, focused, setActiveChannel]
  );

  React.useEffect(() => {
    if (query) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, query]);

  React.useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  React.useEffect(() => {
    if (focused && focused >= 0 && allChannels) {
      setFocusedId(allChannels[focused].id || "");
    }
  }, [allChannels, focused]);

  const setChannel = (channel: Channel<StreamChatType>) => {
    setQuery("");
    setActiveChannel(channel);
  };

  const getChannels = async (text: string) => {
    try {
      const channelResponse = client.queryChannels(
        {
          type: "team",
          name: { $autocomplete: text },
        },
        {},
        { limit: 5 }
      );

      const userResponse = client.queryUsers(
        {
          id: { $ne: client.userID || "" },
          $and: [
            {
              name: { $autocomplete: text },
            },
          ],
        },
        {},
        { limit: 5 }
      );

      const [channels, { users }] = await Promise.all([
        getChannels,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
      setAllChannels([...channels, ...users]);
    } catch (event) {
      setQuery("");
    }

    setLoading(true);
  };

  const getChannelDebounce = _debounce(getChannels, 100, {
    trailing: true,
  });

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setLoading(true);
    setFocused(undefined);
    setQuery(event.target.value);
    if (!event.target.value) return;

    getChannelDebounce(event.target.value);
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          onChange={onSearch}
          placeholder="Search"
          type="text"
          value={query}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          focusedId={focusedId}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};
