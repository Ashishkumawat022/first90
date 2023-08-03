import React from "react";
import adminclasses from "../../admin.style.module.scss";
import studentclasses from "../../participant.style.module.scss";
import coachclasses from "../../coach.style.module.scss";
import { useContext } from "react";
import GlobalContext from "../../store/global-context";


const Footer = () => {
  const globalCtx = useContext(GlobalContext);
  let cx = adminclasses;
  if(window.location.pathname.includes('/admin')){
    cx = adminclasses
  }else if(window.location.pathname.includes('/participant')){
    cx = studentclasses
  }else if(window.location.pathname.includes('/coach')){
    cx = coachclasses
  }

  return (
    <>
      <footer className={`${cx.mainFooter} ${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}>
      © 2022 by First90.io
      </footer>
    </>
  );
  
};

export default Footer;
