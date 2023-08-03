import { createContext, useState } from "react";
import * as React from "react";

const GlobalContext = createContext({
  showMenu: false,
  deskMenu: false,
  showMore: false,
  displayMenu: () => {},
  displayDMenu: () => {},
  displayMore: () => {},
});

export function GlobalContextProvider(props: any) {
  const [showMenu, setshowMenu] = useState(false);
  const [deskMenu, setdeskMenu] = useState(false);
  const [showMore, setshowMore] = useState(false);

  function itemDisplayMenuHandler() {
    if (showMenu) {
      setshowMenu(false);
    } else {
      setshowMenu(true);
    }
  }
  function desktopDisplayMenuHandler() {
    if (deskMenu) {
      setdeskMenu(false);
    } else {
      setdeskMenu(true);
    }
  }

  function itemDisplayMoreHandler() {
    if (showMore) {
      setshowMore(false);
    } else {
      setshowMore(true);
    }
  }
  const context = {
    showMenu: showMenu,
    deskMenu: deskMenu,
    showMore: showMore,
    displayMenu: itemDisplayMenuHandler,
    displayDMenu: desktopDisplayMenuHandler,
    displayMore: itemDisplayMoreHandler,
  };

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;
