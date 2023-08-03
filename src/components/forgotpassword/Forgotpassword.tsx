import React, { FormEvent, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import cx from "./Forgotpassword.module.scss";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useHttp from "../../hooks/use-https";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../images/logo-login.svg";

const Forgotpassword = () => {
  const { sendRequest } = useHttp();
  const [emailInput, setEmailInput] = useState("");

  const notify = (message: string) =>
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const forgotPassword = (response: any) => {
    if (response.status) {
      notify(response.message);
    }
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    let data = {
      email: emailInput,
    };

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/forgotpassword`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      forgotPassword
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
                    <h2>Forgot Password</h2>
                    <Form.Group
                      className={`${cx.formBox}`}
                      controlId="formBasicEmail"
                    >
                      <Form.Control
                        className={`${cx.formClass}`}
                        type="email"
                        placeholder="Email Address"
                        required
                        value={emailInput}
                        onChange={(event) => {
                          setEmailInput(event?.target.value);
                        }}
                      />
                    </Form.Group>

                    <div className={`${cx.submitBtnRow}`}>
                      <Link to="/login" className={`${cx.forogotPassword}`}>
                        Back to login
                      </Link>
                      <Button type="submit" className={`${cx.submitBtn}`}>
                        Submit
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
                <img
                  src="images/logo1.svg"
                  className={`${cx.logoIcon}`}
                  alt="logo"
                />
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

export default Forgotpassword;
