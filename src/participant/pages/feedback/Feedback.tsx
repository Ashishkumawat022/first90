import React, { useEffect } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from "../../../participant.style.module.scss";
import lx from "./Feedback.module.scss";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import RightSidebar from "../../../components/participant-right-sidebar/participant-right-sidebar";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import { FiDownloadCloud, FiLink } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BsStar } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import Sidebar from "../../../components/sidebar/Sidebar";
import Feedbackleft from "../../../components/Feedbackleft/Feedbackleft";
import useHttp from "../../../hooks/use-https";
import { changeModuleArrayValue, moduleArray, simulationIdGet } from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useSelector } from "react-redux";
import { AiOutlineCloudDownload } from "react-icons/ai";
import editIcon from "../../../images/icon_editn.svg";
import { useDispatch } from "react-redux";

const Feedback = (props: any) => {
  let emojiPath = "../../../images";
  const [items, setItems] = useState<any[]>([])

  useEffect(()=>{
     setItems(moduleArray)
  },[moduleArray])

  const urlChange = useSelector(
    (state: any) => state.moduleButtonReducer.value
  );

  return (
    <>
      <Header title="Onboarding Simulation" btnStatus="view-paricipant" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Row>
          <Feedbackleft />
          <Col lg={9}>
            {/* Action: APS documents START */}
            {items?.map((item: any, index: number) => {
              return item.addNewStepButtons[0].steps.map(
                (e: any, num: number) => {
                  return e.actions.map((z: any, number: number) => {
                    if (z.id == urlChange) {
                      return (
                        <>
                          <Card.Title className="mt-2 mb-3">
                            Feedback Rubric
                          </Card.Title>
                          <Card>
                          {z?.actionValue === "Upload a File" ? (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox} ${lx.paragraf}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                            Submission - Upload a File{" "}
                            <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <div className={`${lx.precedent_contract}`}>
                            <div className={`${lx.precedent_contract_body}`}>
                              <h6 className="mt-0">
                                {z?.content?.title}
                              </h6>
                              <ul style={{listStyle:"none"}}>
                                <li>{z?.content?.description}</li>

                                {z?.content?.document?.map(
                                  (item: any) => {
                                    return (
                                      <li>
                                        <a
                                          href={item?.url}
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}
                                        >
                                          {item?.fileName}
                                        </a>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          </div>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              ) : z?.actionValue === "Write an Email" ? (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                             Submission - Replying an Email{" "}
                            <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <h6>Email to partner</h6>
                        </Form.Group>

                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Row>
                            <Col lg={12}>
                              <div className={`${lx.uploadPhotoBox}`}>
                                <img
                                  src={z?.content?.image}
                                  className={`${lx.logoIcon}`}
                                  alt="logo"
                                  width="30px"
                                  height="30px"
                                />
                                <div className={`${lx.uploadPhotoBoxBody}`}>
                                  <h5>{z?.content?.title}</h5>
                                  <p>To: {z?.content?.to}</p>
                                </div>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className={`${lx.subjectInput}`}>
                                <p>Subject:</p>
                                <Form.Group
                                  className={`col-lg-10 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type="text"
                                    value={z.content.subject}
                                    placeholder="Add a subject line to the email here"
                                    disabled
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className={`${lx.emailMessage}`}>
                                <p>{z?.content?.description}</p>

                                <Form.Group
                                  className={`col-lg-12 mb-0 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Hi Mark,"
                                    value={z.content.text}
                                    disabled
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              ) : z?.actionValue === "Question and Answer" ? (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                             Submission - Interview Guide
                            for Client <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <h6>{z?.content?.title}</h6>
                        </Form.Group>

                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Row>
                            {z?.content?.question?.map(
                              (f: any, g: number) => {
                                return (
                                  <Col lg={12}>
                                    <div className={`${lx.emailMessage}`}>
                                      <p>
                                        {index + 1}. {f?.que}
                                      </p>
                                      <Form.Group
                                        className={`col-lg-12 ${cx.formBox}`}
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Control
                                          type="text"
                                          placeholder=""
                                          value={f?.ans}
                                          disabled
                                        />
                                      </Form.Group>
                                    </div>
                                  </Col>
                                );
                              }
                            )}
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              ) : (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox} ${lx.paragraf}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                             Submission - Schedule Live
                            Conversation <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <h6>{z?.content?.title}</h6>
                          <p>{z?.content?.description}</p>
                        </Form.Group>

                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Row>
                            <Col lg={12}>
                              <div
                                className={`${lx.uploadPhotoBox} ${lx.uploadPhotoAction}`}
                              >
                                <img
                                  src={
                                    z?.content?.image
                                      ? z?.content?.image
                                      : editIcon
                                  }
                                  className={`${lx.logoIcon}`}
                                  alt="logo"
                                  width="50px"
                                  height="50px"
                                />
                                <div className={`${lx.uploadPhotoBoxBody}`}>
                                  <p>
                                    Action Title:{" "}
                                    <span>
                                      {" "}
                                      {z?.content?.contactName}
                                    </span>
                                  </p>
                                  <p>
                                    Email:{" "}
                                    <span>
                                      {z?.content?.contactEmail}
                                    </span>
                                  </p>
                                  <p>
                                    Phone:{" "}
                                    <span>
                                      {z?.content?.contactNumber}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              )}
              </Card>
                          {z.content.completeStatus === "Completed" ? 
                          <>
                          <Card className={`${lx.disabled}`}>
                            <Card.Body>
                              <Form className="row">
                                <Form.Group
                                  className={`col-lg-12 mb-0 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>
                                    Overall Feedback and Score
                                  </Form.Label>
                                  <div className={`${lx.feedbackOverall}`}>
                                    <p className="mb-0">
                                      {z?.feedbackInputByCouch}
                                    </p>
                                    <div className={`${lx.feedbackRating}`}>
                                      <ul>
                                        {z?.feedbackRatingByCouch?.map(
                                          (star: any, n: number) => {
                                            return (
                                              <li>
                                                {star?.point === 0 ? (
                                                  <NavLink to="#">
                                                    <BsStar />
                                                  </NavLink>
                                                ) : star?.point === 0.5 ? (
                                                  <NavLink to="#">
                                                    <BsStarHalf />
                                                  </NavLink>
                                                ) : (
                                                  <NavLink to="#">
                                                    <BsStarFill />
                                                  </NavLink>
                                                )}
                                              </li>
                                            );
                                          }
                                        )}
                                        <li className={`${lx.starBlue}`}>
                                          <NavLink to="#">
                                            <img
                                              src={`${emojiPath}/${z.feedbackEmoji}`}
                                              width="30px"
                                              height="30px"
                                            />
                                          </NavLink>
                                        </li>
                                      </ul>
                                      <p>Scored by {z?.feedbackCoachName}</p>
                                    </div>
                                  </div>
                                </Form.Group>
                              </Form>
                            </Card.Body>
                          </Card>
                          <Card className={`${lx.disabled}`}>
                            <Card.Body>
                              <Form className="row">
                                <Form.Group
                                  className={`col-lg-12 mb-0 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>Detailed Feedback</Form.Label>
                                  {z?.feedback?.map((a: any, ind: number) => {
                                    return (
                                      <div className={`${lx.feedbackOverall}`}>
                                        <p className="mb-0">
                                          <b> 1. {a?.title}: </b>{" "}
                                          {a?.description}?
                                          <span>{a?.feedback}</span>
                                        </p>
                                        <div className={`${lx.feedbackNumber}`}>
                                          <ul>
                                            <li
                                              className={
                                                a?.feedbackRating == 1
                                                  ? `${lx.numberDark}`
                                                  : ""
                                              }
                                            >
                                              <NavLink to="#">1</NavLink>
                                            </li>
                                            <li
                                              className={
                                                a?.feedbackRating == 2
                                                  ? `${lx.numberDark}`
                                                  : ""
                                              }
                                            >
                                              <NavLink to="#">2</NavLink>
                                            </li>
                                            <li
                                              className={
                                                a?.feedbackRating == 3
                                                  ? `${lx.numberDark}`
                                                  : ""
                                              }
                                            >
                                              <NavLink to="#">3</NavLink>
                                            </li>
                                            <li
                                              className={
                                                a?.feedbackRating == 4
                                                  ? `${lx.numberDark}`
                                                  : ""
                                              }
                                            >
                                              <NavLink to="#">4</NavLink>
                                            </li>
                                            <li
                                              className={
                                                a?.feedbackRating == 5
                                                  ? `${lx.numberDark}`
                                                  : ""
                                              }
                                            >
                                              <NavLink to="#">5</NavLink>
                                            </li>
                                          </ul>
                                          <div className={`${lx.feedbackVery}`}>
                                            <p>
                                              Very
                                              <br /> poor
                                            </p>
                                            <p className="p-0">
                                              Very
                                              <br /> strong
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </Form.Group>
                              </Form>
                            </Card.Body>
                          </Card>
                          <Card className={`${lx.disabled}`}>
                            <Card.Body>
                              <Form className="row">
                                <Form.Group
                                  className={`col-lg-12 mb-0 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>
                                    Additional Resources (Post-Submission)
                                  </Form.Label>
                                  <div className={`${lx.additionalBtn}`}>
                                    {z?.feedbackResource?.map(
                                      (s: any, i: number) => {
                                        return (
                                          <a
                                            href={s.url}
                                            style={{ textDecoration: "none" }}
                                          >
                                            {s.title}
                                          </a>
                                        );
                                      }
                                    )}
                                    {z?.feedbackResourceByCoach?.map(
                                      (s: any, i: number) => {
                                        return (
                                          <a
                                            href={s.url}
                                            style={{ textDecoration: "none" }}
                                          >
                                            {s.title}
                                          </a>
                                        );
                                      }
                                    )}
                                  </div>
                                </Form.Group>
                              </Form>
                            </Card.Body>
                          </Card> </> : "" }
                        </>
                      );
                    }
                  });
                }
              );
            })}
          </Col>
        </Row>
      </section>
      <Footer />
    </>
  );
};

export default Feedback;
