import React, { useCallback, useContext, useState } from "react";

type GiphyState = Record<"main-input" | "thread-input", boolean>;

const noop = () => Promise.resolve();

export type Workspace =
  | "Chat"
  | "Admin-Channel-Edit"
  | "Admin-Channel-Create__team"
  | "Admin-Channel-Create__messaging";

// type Record<K extends string | number | symbol, T> = { [P in K]: T; }

type workSpaceContext = {
  activeWorkspace: Workspace;
  closeAdminPanel: () => void;
  displayWorkspace: (w: Workspace) => void;
  pinnedMessageListOpen: boolean;
  togglePinnedMessageListOpen: () => void;
  closePinnedMessageListOpen: () => void;
};

const WorkspaceControllerContext = React.createContext<workSpaceContext>({
  activeWorkspace: "Chat",
  closeAdminPanel: noop,
  displayWorkspace: noop,
  pinnedMessageListOpen: false,
  togglePinnedMessageListOpen: noop,
  closePinnedMessageListOpen: noop,
});

export const WorkspaceController = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>("Chat");
  const [pinnedMessageListOpen, setPinnedMessageListOpen] =
    useState<boolean>(false);
  const displayWorkspace: workSpaceContext["displayWorkspace"] = useCallback(
    (workspace) => {
      setActiveWorkspace(workspace);
      setPinnedMessageListOpen(false);
    },
    [setActiveWorkspace]
  );

  const closeAdminPanel = useCallback(() => {
    displayWorkspace("Chat");
  }, [displayWorkspace]);

  const togglePinnedMessageListOpen = useCallback(
    () => setPinnedMessageListOpen((prev) => !prev),
    []
  );

  const closePinnedMessageListOpen = useCallback(
    () => setPinnedMessageListOpen(false),
    []
  );
  return (
    <WorkspaceControllerContext.Provider
      value={{
        activeWorkspace,
        closeAdminPanel,
        displayWorkspace,
        pinnedMessageListOpen,
        closePinnedMessageListOpen,
        togglePinnedMessageListOpen,
      }}
    >
      {children}
    </WorkspaceControllerContext.Provider>
  );
};
