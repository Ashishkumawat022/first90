import React, { useEffect, useState } from "react";
import { HashRouter, NavLink, useHistory, useParams } from "react-router-dom";
import cx from "./Participantsimulation.module.scss";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { useContext } from "react";
import GlobalContext from "../../store/global-context";
import { AiOutlineDelete } from "react-icons/ai";


import { Col } from "react-bootstrap";

const Simulationmenu = (props: any) => {


  const globalCtx = useContext(GlobalContext);
  const history = useHistory();


  const [m1Display, setm1Display] = useState(true);
  const [m2Display, setm2Display] = useState(false);


  return (
    <>
      <Col lg={3}>

        <div className={`${cx.MenuBodyS2}`}>

          <h5><span>«</span> Simulation</h5>

          <h6>Participant Mode</h6>
          <p>Hello, you’re viewing the participant mode!</p>

          <ul className={`${cx.s2menuList}`}>

            <li className={`${m1Display ? `${cx.active}` : ''}`}>
              <button className="btn" type="button" onClick={() => { setm1Display(!m1Display) }}>
                <div className={`${cx.menuName}`}>Module 1</div>
              </button>
              <ul className={`${cx.first}`}>
                <HashRouter basename="m1" hashType="noslash">
                  <li>
                    <NavLink to="/step1">
                      <div className={`${cx.menuName}`}>Step 1</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step2">
                      <div className={`${cx.menuName}`}>Step 2</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step3">
                      <div className={`${cx.menuName}`}>Step 3</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step4">
                      <div className={`${cx.menuName}`}>Step 4</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step5" className={`${cx.addStepBtn}`}>
                      <div className={`${cx.menuName}`}>Add New Step <AiOutlinePlusCircle className={`${cx.icon}`} /></div>
                    </NavLink>
                  </li>

                </HashRouter>
              </ul>
            </li>


            <li className={`${m2Display ? `${cx.active}` : ''}`}>
              <button className="btn" type="button" onClick={() => { setm2Display(!m2Display) }}>
                <div className={`${cx.menuName}`}>Module 2</div>
              </button>
              <ul className={`${cx.first}`}>
                <HashRouter basename="m2" hashType="noslash">
                  <li>
                    <NavLink to="/step1">
                      <div className={`${cx.menuName}`}>Step 1</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step2">
                      <div className={`${cx.menuName}`}>Step 2</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step3">
                      <div className={`${cx.menuName}`}>Step 3</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/step4">
                      <div className={`${cx.menuName}`}>Step 4</div>
                    </NavLink>
                  </li>
                </HashRouter>
              </ul>
            </li>
          </ul>
        </div>
      </Col>
    </>
  );
};

export default Simulationmenu;
