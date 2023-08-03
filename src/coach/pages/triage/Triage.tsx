import React from "react";
import { NavLink } from "react-router-dom";
import cx from './Triage.module.scss';
import { Container, Row, Col, ProgressBar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const CoachTriage = () => {
  return (
    <>
      <section className={`${cx.triageSection}`}>
        <Container className={`${cx.cotainerBox}`}>
          <Col className={`${cx.loginInSide}`}>
            <Col className={`${cx.logoTitle}`}>
                 <img src="../images/logo.svg" className={`${cx.logoIcon}`} alt="logo" />
                 <h2>Welcome to First90! Select a simulation to get started.</h2>
            </Col>
            <Row>
              <Col md={6} lg={3}>
                <div className={`${cx.cardBox}`}>
                  <h4>Simulation 1</h4>
                  <img src="../images/s1.svg" className={`${cx.cardImg}`} alt="img" />
                  <div className={`${cx.cardFt}`}>
                    <img src="../images/Green-lightbulb.svg" alt="img" />
                    <p>Two ungraded submissions</p>
                  </div>
                </div> 
              </Col>
              <Col md={6} lg={3}>
                <div className={`${cx.cardBox}`}>
                  <h4>Simulation 2</h4>
                  <img src="../images/s2.svg" className={`${cx.cardImg}`} alt="img" />
                  <div className={`${cx.cardFt}`}>
                    <img src="../images/Green-lightbulb.svg" alt="img" />
                    <p>Two ungraded submissions</p>
                  </div>
                </div> 
              </Col>
              <Col md={6} lg={3}>
                <div className={`${cx.cardBox}`}>
                  <h4>Simulation 3</h4>
                  <img src="../images/s3.svg" className={`${cx.cardImg}`} alt="img" />
                  <div className={`${cx.cardFt}`}>
                    <img src="../images/Green-lightbulb.svg" alt="img" />
                    <p>Two ungraded submissions</p>
                  </div>
                </div> 
              </Col>
              <Col md={6} lg={3}>
                <div className={`${cx.cardBox}`}>
                  <h4>Simulation 4</h4>
                  <img src="../images/s4.svg" className={`${cx.cardImg}`} alt="img" />
                  <div className={`${cx.cardFt}`}>
                    <img src="../images/Green-lightbulb.svg" alt="img" />
                    <p>Two ungraded submissions</p>
                  </div>
                </div> 
              </Col>
            </Row>
          </Col>
        </Container>
      </section>

      <footer className={`${cx.mainFooter}`}>
        <Container>
          <Col>
            <Row className={`${cx.mainFooterRow}`}>
              <Col md={3} lg={3} className={`text-center ${cx.ftBox} ${cx.copyright}`}>
                <img src="../images/logo1.svg" className={`${cx.logoIcon}`} alt="logo" />
                <p>© 2022 by First90.io</p>
              </Col>
              <Col md={9} lg={9} className={`${cx.ftBoxRight}`}>
                <Row>
                  <Col md={4} lg={4} className={`${cx.ftBox}`}>
                    <h5>Support</h5>
                    <ul>
                      <li><NavLink to="/">Privacy Notice</NavLink></li>
                      <li><NavLink to="/">FAQ</NavLink></li>
                    </ul>
                  </Col>
                  <Col md={4} lg={4} className={`${cx.ftBox}`}>
                    <h5>Company</h5>
                    <ul>
                      <li><NavLink to="/">About</NavLink></li>
                      <li><NavLink to="/">Team</NavLink></li>
                    </ul>
                  </Col>
                  <Col md={4} lg={4} className={`${cx.ftBox}`}>
                    <h5>Contact</h5>
                    <ul>
                      <li><NavLink to="/">info@first90.io</NavLink></li>
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

export default CoachTriage;
