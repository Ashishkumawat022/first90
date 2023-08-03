import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import cx from "./Triage.module.scss";
import { Container, Row, Col, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../images/logo.svg";
import logo1 from "../../../images/logo1.svg";
import s1 from "../../../images/s1.svg";
import s2 from "../../../images/s2.svg";
import s3 from "../../../images/s3.svg";
import s4 from "../../../images/s4.svg";
import { RiSpam2Fill } from "react-icons/ri";
import { simulationData } from "../../../reduxToolkit/reducers/loginReducer";
import { ParticipantRoutes } from "../../../types/types";
import { useDispatch } from "react-redux";
import { setTeamName } from "../../../reduxToolkit/reducers/moduleButtonReducer";

const Triage = () => {
  let Ldata = localStorage.getItem("simulationData")!;
  let localData = JSON.parse(Ldata)!;
  let loginData = localStorage.getItem("data")!;
  let localLoginData = JSON.parse(loginData)!;
  const history = useHistory();
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(localData)

  return (
    <>
      <section className={`${cx.triageSection}`}>
        <Container className={`${cx.cotainerBox}`}>
          <Col className={`${cx.loginInSide}`}>
            <Col className={`${cx.logoTitle}`}>
              <img src={logo} className={`${cx.logoIcon}`} alt="logo" />
              <h2>Welcome to First90! Select a simulation to get started.</h2>
            </Col>
            <Row>
              {
                data?.map((item:any)=>{
                  return <Col md={6} lg={3}>
                  <div className={`${cx.cardBox}`} onClick={()=>{
                    if(localLoginData?.isfirst===true){
                      dispatch(setTeamName(item?.teamName))
                      history.push(ParticipantRoutes.PARTICIPANTS_STEPONE);
                    }else{
                      dispatch(setTeamName(item?.teamName))
                      history.push(`/participant/simulations/${item?._id}`);
                    }
                  }
                  }>
                    <h5>{item?.addSimulation?.NameOfSimulation}</h5>
                    <h6><span>Team Name:</span> {item?.teamName}</h6>
                    <div className={`${cx.cardImg} d-flex justify-content-center align-items-center`} style={{ cursor: "flex", border: "2px solid #009ce0", borderRadius: "50%", width: "150px", height: "150px", backgroundColor: "#009ce0" }}>
                              <span style={{ fontSize: "40px", color: "white" }}>{item?.addSimulation?.NameOfSimulation.slice(0, 1).toUpperCase()}</span>
                            </div>
                    <div className={`${cx.cardFt}`}>
                      <ProgressBar variant="success" now={item?.progress} />
                      <span>{item?.progress}</span>
                    </div>
                  </div>
                </Col>
                })
              }
            </Row>
          </Col>
        </Container>
      </section>

      <footer className={`${cx.mainFooter}`}>
        <Container>
          <Col>
            <Row className={`${cx.mainFooterRow}`}>
              <Col
                md={3}
                lg={3}
                className={`text-center ${cx.ftBox} ${cx.copyright}`}
              >
                <img src={logo1} className={`${cx.logoIcon}`} alt="logo" />
                <p>© 2022 by First90.io</p>
              </Col>
              <Col md={9} lg={9} className={`${cx.ftBoxRight}`}>
                <Row>
                  <Col md={4} lg={4} className={`${cx.ftBox}`}>
                    <h5>Support</h5>
                    <ul>
                      <li>
                        <NavLink to="/">Privacy Notice</NavLink>
                      </li>
                      <li>
                        <NavLink to="/">FAQ</NavLink>
                      </li>
                    </ul>
                  </Col>
                  <Col md={4} lg={4} className={`${cx.ftBox}`}>
                    <h5>Company</h5>
                    <ul>
                      <li>
                        <NavLink to="/">About</NavLink>
                      </li>
                      <li>
                        <NavLink to="/">Team</NavLink>
                      </li>
                    </ul>
                  </Col>
                  <Col md={4} lg={4} className={`${cx.ftBox}`}>
                    <h5>Contact</h5>
                    <ul>
                      <li>
                        <NavLink to="/">info@first90.io</NavLink>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Container>
      </footer>
    </>
  );
};

export default Triage;
