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
