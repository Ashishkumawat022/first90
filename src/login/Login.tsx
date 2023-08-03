import React, { FormEvent, Fragment, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import cx from "./Login.module.scss";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import useHttp from "../hooks/use-https";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/logo-login.svg";
import logo1 from "../images/logo1.svg";
import {
  AdminRoutes,
  CoachRoutes,
  ParticipantRoutes,
  Roles,
} from "../types/types";
import Forgotpassword from "../components/forgotpassword/Forgotpassword";
import {
  changeStatusLogin,
  saveSimulationData,
} from "../reduxToolkit/reducers/loginReducer";
import { useDispatch } from "react-redux";
import firebase from "firebase";

// firebase.initializeApp({
//   apiKey: "AIzaSyC4otJzHozirr8GhEGjDwVbV3Imx0OAmJI",
//   authDomain: "first90-47f17.firebaseapp.com",
//   projectId: "first90-47f17",
//   storageBucket: "first90-47f17.appspot.com",
//   messagingSenderId: "514496885083",
//   appId: "1:514496885083:web:fa518fa8e77355f632aa7e",
//   measurementId: "G-0CFTSLZCX3"
// });

const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { error, sendRequest } = useHttp();
  // const { sendRequest:notificationRequest } = useHttp();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [show, setShow] = useState(true);
  const [onetimenotify, setOnetimenotify] = useState(false);
  const [errtimenotify, setErrtimenotify] = useState(false);

  useEffect(() => {
    if (onetimenotify) {
      notify();
      setTimeout(() => {
        setOnetimenotify(false);
      }, 5000);
    }
  }, [onetimenotify]);

  useEffect(() => {
    if (errtimenotify) {
      notify2(
        "Email address and/or password you have entered do not match our records."
      );
      setTimeout(() => {
        setErrtimenotify(false);
      }, 5000);
    }
  }, [errtimenotify]);

  const notify = () =>
    toast(
      "Hi - welcome to First90 Training! Before you begin using the platform, please fill out some basic account information and change your password",
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  const notify2 = (text: string) =>
    toast(text, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    const msg: any = firebase.messaging();
    msg
      .requestPermission()
      .then(() => {
        return msg.getToken();
      })
      .then((data: any) => {
        setFcmToken(data);
      });
  }, []);

  const login = (taskData: any) => {
    if (taskData.status) {
      dispatch(changeStatusLogin(taskData.admindata[0].isfirst));
      dispatch(saveSimulationData(taskData.simulationData));
      setOnetimenotify(true);
      setTimeout(() => {
        localStorage.setItem("token", taskData.token);
        localStorage.setItem(
          "simulationData",
          JSON.stringify(taskData.simulationData)
        );
        localStorage.setItem("data", JSON.stringify(taskData.admindata[0]));
        const datatype = taskData.admindata[0].role;
        if (datatype === Roles.ADMIN) {
          history.push(AdminRoutes.ADMIN_ACCOUNT);
        } else if (datatype === Roles.PARTICIPANTS) {
          if (taskData.admindata[0].isfirst === true) {
            history.push(ParticipantRoutes.PARTICIPANT_ACCOUNT);
            // notificationHandler();
          } else {
            history.push(ParticipantRoutes.PARTICIPANTS_TRIAGE);
          }
        } else if (datatype === Roles.COACH) {
          if (taskData.admindata[0].isfirst === true) {
            history.push(CoachRoutes.COACH_ACCOUNT);
          } else {
            history.push(CoachRoutes.COACH_DASHBOARD);
          }
        }
      }, 2000);
    } else {
      setErrtimenotify(true);
    }
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    let data = {
      password: passwordInput,
      email: emailInput,
      fcmToken: fcmToken,
    };

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/adminlogin`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      login
    );
  };

  if (error) {
    notify2(error);
    return <ToastContainer />;
  }

  return (
    <Fragment>
      <ToastContainer />
      <section className={`${cx.loginSection}`}>
        <Container className={`${cx.cotainerBox}`}>
          <Col className={`${cx.loginInSide}`}>
            <Col md={12} lg={11} className={`m-auto ${cx.centerBox}`}>
              <Row className="align-items-center">
                <Col md={6} lg={6} className={`${cx.loginLeft}`}>
                  <img src={logo} className={`${cx.logoIcon}`} alt="logo" />
                  <h5>
                    First90 makes training new employees easier and more
                    effective.
                  </h5>
                </Col>
                <Col md={6} lg={6} className={`${cx.loginRight}`}>
                  <Form onSubmit={submitHandler} className={`${cx.form}`}>
                    <Form.Group
                      className={`${cx.formBox}`}
                      controlId="formBasicEmail"
                    >
                      <Form.Control
                        className={`${cx.formClass}`}
                        type="email"
                        required
                        value={emailInput}
                        onChange={(event) => {
                          setEmailInput(event?.target.value);
                        }}
                        placeholder="Email Address"
                      />
                    </Form.Group>

                    <Form.Group
                      className={`${cx.formBox}`}
                      controlId="formBasicPassword"
                    >
                      <Form.Control
                        className={`${cx.formClass}`}
                        type={show ? "password" : "text"}
                        value={passwordInput}
                        placeholder="Password"
                        onChange={(event) => {
                          setPasswordInput(event?.target.value);
                        }}
                      />
                      <div className={`${cx.passwordAction}`}>
                        {show ? (
                          <AiOutlineEye
                            onClick={() => {
                              setShow(false);
                            }}
                          />
                        ) : (
                          <AiOutlineEyeInvisible
                            onClick={() => {
                              setShow(true);
                            }}
                          />
                        )}
                      </div>
                    </Form.Group>
                    <div className={`${cx.submitBtnRow}`}>
                      <NavLink
                        to="/forgot-password"
                        className={`${cx.forogotPassword}`}
                      >
                        Forgot Password?
                      </NavLink>
                      <Button type="submit" className={`${cx.submitBtn}`}>
                        Login
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Col>
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
    </Fragment>
  );
};

export default Login;
