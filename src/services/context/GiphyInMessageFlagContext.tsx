import React, { useCallback, useContext, useState } from "react";

type GiphyState = Record<"main-input" | "thread-input", boolean>;

// type Record<K extends string | number | symbol, T> = { [P in K]: T; }

type GiphyStateobj = {
  clearGiphyFlag: (isReply: boolean) => void;
  clearGiphyFlagMainInput: () => void;
  clearGiphyFlagThread: () => void;
  inputHasGiphyMessage: (isReply: boolean) => boolean;
  isComposingGiphyMessage: () => boolean;
  isComposingGiphyReply: () => boolean;
  setComposeGiphyMessageFlag: () => void;
  setComposeGiphyReplyFlag: () => void;
};

export const GiphyInMessageFlayContext = React.createContext<GiphyStateobj>(
  {} as GiphyStateobj
);

export const GiphyInMessageFlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [giphyState, setGiphyState] = useState<GiphyState>({
    "main-input": false,
    "thread-input": false,
  });

  const clearGiphyFlag = useCallback((isReply: boolean) => {
    setGiphyState((prev) =>
      isReply
        ? { ...prev, "thread-input": false }
        : { ...prev, "main-input": false }
    );
  }, []);

  const clearGiphyFlagMainInput = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, "main-input": false }));
  }, []);

  const clearGiphyFlagThread = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, "thread-input": false }));
  }, []);

  const inputHasGiphyMessage = useCallback(
    (isReply: boolean) =>
      isReply ? giphyState["thread-input"] : giphyState["main-input"],
    [giphyState]
  );

  const isComposingGiphyMessage = useCallback(
    () => giphyState["main-input"],
    [giphyState]
  );

  const isComposingGiphyReply = useCallback(
    () => giphyState["thread-input"],
    [giphyState]
  );

  const setComposeGiphyMessageFlag = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, "main-input": true }));
  }, []);

  const setComposeGiphyReplyFlag = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, "thread-input": true }));
  }, []);

  return (
    <GiphyInMessageFlayContext.Provider
      value={{
        clearGiphyFlag,
        clearGiphyFlagMainInput,
        clearGiphyFlagThread,
        inputHasGiphyMessage,
        isComposingGiphyMessage,
        isComposingGiphyReply,
        setComposeGiphyMessageFlag,
        setComposeGiphyReplyFlag,
      }}
    >
      {children}
    </GiphyInMessageFlayContext.Provider>
  );
};

export const useGiphyInMessageContext = () => {
  if (!GiphyInMessageFlayContext) throw Error("Context must be provided ");
  return useContext(GiphyInMessageFlayContext);
};
