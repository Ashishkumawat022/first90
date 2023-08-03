import React, { FormEvent, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import cx from "./Changepassword.module.scss";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import useHttp from "../../hooks/use-https";
import logo from "../../images/logo.svg";
import logo1 from "../../images/logo1.svg";
const Changepassword = () => {
  let history = useHistory();
  let param: { id: string } = useParams();
  const { sendRequest } = useHttp();
  const [show, setShow] = useState(true);
  const [confirmshow, setConfirmshow] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [cpasswordInput, setCpasswordInput] = useState("");

  const notify = (message: string) =>
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const resetPassword = (response: any) => {
    if (response.status) {
      notify(response.msg);
      setTimeout(() => {
        history.push("/login");
      }, 4000);
    } else {
      notify(response.msg);
    }
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    let data = {
      new_password: passwordInput,
      confirm_password: cpasswordInput,
    };

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/reset_password/` + param?.id,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      resetPassword
    );
  };

  return (
    <>
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
                    <h2>Reset Password</h2>

                    <Form.Group
                      className={`${cx.formBox}`}
                      controlId="formBasicPassword"
                    >
                      <Form.Control
                        className={`${cx.formClass}`}
                        type={show ? "password" : "text"}
                        placeholder="New Password"
                        required
                        value={passwordInput}
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
                        {/* <AiOutlineEyeInvisible /> */}
                      </div>
                    </Form.Group>
                    <Form.Group
                      className={`${cx.formBox}`}
                      controlId="formBasicConfirmPassword"
                    >
                      <Form.Control
                        className={`${cx.formClass}`}
                        type={confirmshow ? "password" : "text"}
                        required
                        value={cpasswordInput}
                        onChange={(event) => {
                          setCpasswordInput(event?.target.value);
                        }}
                        placeholder="Confirm Password"
                      />
                      <div className={`${cx.passwordAction}`}>
                        {confirmshow ? (
                          <AiOutlineEye
                            onClick={() => {
                              setConfirmshow(false);
                            }}
                          />
                        ) : (
                          <AiOutlineEyeInvisible
                            onClick={() => {
                              setConfirmshow(true);
                            }}
                          />
                        )}
                        {/* <AiOutlineEyeInvisible /> */}
                      </div>
                    </Form.Group>
                    <div className={`${cx.submitBtnRow}`}>
                      <Button type="submit" className={`${cx.submitBtn}`}>
                        Change Password
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
    </>
  );
};

export default Changepassword;
