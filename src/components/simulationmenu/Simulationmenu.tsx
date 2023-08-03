import React from "react";
import cx from "./Simulationmenu.module.scss";

import { Col } from "react-bootstrap";
import ModuleButton from "./ModuleButton";
import { useHistory } from "react-router";

const Simulationmenu = (props: any) => {

  const history = useHistory()

  return (
    <>
      <Col lg={3}>

        {window.location.pathname.includes("/admin/edit-simulation") && (

          <div className={`${cx.MenuBodyS2}`}>

            <h5 onClick={() => history.push('/admin/simulation')} style={{ cursor: "pointer" }}><span>«</span> Edit Simulation</h5>

            <h6>Edit Mode</h6>
            <p>Hello, you’re in Edit Mode!</p>

            <ModuleButton />

          </div>
        )}

        {window.location.pathname.includes("/admin/participant-view") && (

          <div className={`${cx.MenuBodyS2}`}>

            <h5 onClick={() => history.push('/admin/simulation')} style={{ cursor: "pointer" }}><span>«</span> View Simulation</h5>

            <h6>View Mode</h6>
            <p>Hello, you’re in View Mode!</p>

            <ModuleButton />

          </div>
        )}

      </Col>
    </>
  );
};

export default Simulationmenu;
