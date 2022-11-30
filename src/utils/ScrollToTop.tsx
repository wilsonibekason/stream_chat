import * as React from "react";
import { useLocation } from "react-router-dom";
export const scrollToTop = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  return children || null;
};

/**
 *
 * @param top
 * @param left
 * @param behavior // defines the behaviour to the scroll aniamtion
 * @see https://github.com/wilsonibekason
 */

export const scrollDirections = (
  top: number,
  left: number,
  behavior?: behavior
) => {
  const random = Math.round(Math.floor(Math.random() * 10));
  window.scrollTo({
    top: top ? top : random,
    left: left || random,
    behavior: behavior,
  });
};

type behavior = "auto" | "smooth";
