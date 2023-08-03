import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../coach.style.module.scss";
import lx from "./Dashboard.module.scss";
import { FiPlusSquare } from "react-icons/fi";
import { AiOutlineSetting } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { ImBooks } from "react-icons/im";
import { MdLightbulb } from "react-icons/md";
import { Button, Modal } from "react-bootstrap";

import { NavLink, useHistory, useParams } from "react-router-dom";
import { Card, Col, Row, Form, OverlayTrigger } from "react-bootstrap";
import {
  changeCompleteStatus,
  changeDivUrl,
  changeModuleArrayValue,
  moduleArray,
  simulationId,
  simulationIdGet,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";
import useHttp from "../../../hooks/use-https";

const DashboardParticipant = (props: any) => {
  let loginData = localStorage.getItem("data")!;
  let localLoginData = JSON.parse(loginData)!;
  const [items, setItems] = useState<any[]>([]);
  const [simulationDetails, setSimulationDetails] = useState<any>();
  const [actionPending, setActionPending] = useState<any>();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [rateOne, setRateOne] = useState<number>(0);
  const [rateTwo, setRateTwo] = useState<number>(0);
  const [rateThree, setRateThree] = useState<number>(0);
  const [feedText, setFeedText] = useState<string>("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [verify, setVerify] = useState("false");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const param: any = useParams();
  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttp();
  const { sendRequest: postRequest } = useHttp();
  const { sendRequest: updateSimulationRequest } = useHttp();
  const { sendRequest: evalutionRequest } = useHttp();
  const { sendRequest: checkEvalutionRequest } = useHttp();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showc1, setc1Show] = useState(false);

  const handlec1Close = () => setc1Show(false);
  const handlec1Show = () => setc1Show(true);

  useEffect(() => {
    if (items?.length !== 0) setItems(moduleArray);
  }, [moduleArray]);

  useEffect(() => {
    if (
      items.length > 0 &&
      showPopUp === true &&
      items[0]?.completedStatus === 0
    ) {
      handlec1Show();
      dispatch(changeCompleteStatus(items));
      updateSimulation();
    }
  }, [showPopUp, items]);

  const simulationResponse = (data: any) => {
    let moduleFull = data?.data[0]?.Simulation?.AddallModule;
    dispatch(changeModuleArrayValue(moduleFull));
    setItems(moduleFull);
    setSimulationDetails(data?.data[0]?.Simulation);
    let pendingAction: any;
    moduleFull?.map((e: any) => {
      if (e?.addNewStepButtons) {
        e?.addNewStepButtons[0]?.steps?.map((a: any) => {
          if (pendingAction == undefined) {
            pendingAction = a?.actions?.find(
              (z: any, index: number) => z?.disable == 0
            );
          }
        });
      }
    });
    setActionPending(pendingAction);
    if (pendingAction == undefined) setShowPopUp(true);
    const perActionData: any[] = [];
    moduleFull?.map((e: any) => {
      if (e?.addNewStepButtons) {
        e?.addNewStepButtons[0]?.steps?.map((a: any) => {
          a?.actions?.map((z: any, index: number) => {
            if (z?.content?.submitTime && z.content.submitTime !== "") {
              perActionData.push({
                col1: `${index + 1}`,
                col2: z?.actionValue,
                col3: z.content.submitTime,
                col4: z.content.completeStatus,
                col5: z.id,
              });
            }
          });
        });
      }
    });
    let ascending = perActionData.sort(
      (a, b) => Number(a.col3) - Number(b.col3)
    );
    setFeedbackList(ascending);
  };

  const getSimulation = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/student_dashboard?students_id=${localLoginData?._id}&team_id=${param?.id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      simulationResponse
    );
  };

  useEffect(() => {
    getSimulation();
    dispatch(simulationIdGet(param.id));
  }, []);

  const rateFuncOne = (rate: number) => {
    setRateOne(rate);
  };
  const rateFuncTwo = (rate: number) => {
    setRateTwo(rate);
  };
  const rateFuncThree = (rate: number) => {
    setRateThree(rate);
  };

  const getFeedStudent = (responseData: any) => {
    handleClose();
  };

  const addFeedStudent = () => {
    let data = JSON.stringify({
      discretionary: feedText,
      type1: rateOne,
      type2: rateTwo,
      type3: rateThree,
      student_id: localLoginData?._id,
      simulationId: simulationId,
    });

    postRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/Add_evalutionOfSimulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      getFeedStudent
    );
  };

  const updationResponse = (responseData: any) => {
    console.log(responseData.data);
  };

  const updateSimulation = () => {
    let data = JSON.stringify({
      id: param?.id,
      AddallModule: moduleArray,
    });

    updateSimulationRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/update_team_simulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      updationResponse
    );
  };

  const getEvalutionResponse = (data: any) => {
    setRateOne(data.data[0]?.type1);
    setRateTwo(data.data[0]?.type2);
    setRateThree(data.data[0]?.type3);
    setFeedText(data.data[0]?.discretionary);
    handleShow();
  };
  const getEvalution = () => {
    evalutionRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getevalutionOfSimulation?student_id=${localLoginData?._id}&simulation_id=${simulationId}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getEvalutionResponse
    );
  };

  const checkEvalutionResponse = (data: any) => {
    setVerify(data.verify);
    if (data.verify == "true") {
      getEvalution();
    } else {
      handleShow();
    }
  };
  const checkEvalution = () => {
    checkEvalutionRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/checkevalutionOfSimulation?student_id=${localLoginData?._id}&simulation_id=${simulationId}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      checkEvalutionResponse
    );
  };

  return (
    <>
      <Header title="Above the Bar LLC: Onboarding Simulation" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title className="mt-4">
            {localLoginData?.firstName} {localLoginData?.lastName} Dashboard
          </Card.Title>
          <Row>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/participant/simulations/${simulationId}`}
                  style={{ textDecoration: "none", color: "#006182" }}
                >
                  <h5>Enter the Simulation</h5>
                  <MdLightbulb className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/participant/teams/${simulationId}`}
                  style={{ textDecoration: "none", color: "#006182" }}
                >
                  <h5>View My Team</h5>
                  <FiUsers className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/participant/resource/${simulationId}`}
                  style={{ textDecoration: "none", color: "#006182" }}
                >
                  <h5>View Latest Resource</h5>
                  <ImBooks className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to="/participant/account"
                  style={{ textDecoration: "none", color: "#006182" }}
                >
                  <h5>Update Your Account</h5>
                  <AiOutlineSetting className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12} lg={12} xl={12} className="mb-4">
              <div className={`${lx.currentProgress}`}>
                <Row className={`align-items-center`}>
                  <Col md={10}>
                    <div className={`${lx.currentBox}`}>
                      <h4>Simulation Overview</h4>
                      <p>{simulationDetails?.DiscreptionOfSimulation}</p>
                    </div>
                  </Col>
                  <Col md={2}>
                    <div className={`text-center`}>
                      <img src="../../../images/megaphone.svg" alt="" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {actionPending === undefined ? (
              <Col md={12} lg={6} xl={6}>
                <div className={`${lx.currentProgress} ${lx.currentShodow}`}>
                  <div className={`${lx.currentBox}`}>
                    <h4>Congratulations! You have completed the simulation.</h4>
                    <img
                      src="../../../images/st1.svg"
                      width="100%"
                      style={{ padding: "30px 0px" }}
                    />
                    <h4 style={{ color: "#222" }}>
                      Fill out the simulation evaluation
                    </h4>
                    <p className="mb-4">
                      Thank you for completing the simulation! Please complete
                      our feedback survey so that we can improve the experience
                      for future new hires.
                    </p>

                    <div className={`${lx.link_simulation}`}>
                      <NavLink to="#" onClick={checkEvalution}>
                        Complete Feedback
                      </NavLink>
                    </div>
                  </div>
                </div>
              </Col>
            ) : (
              <Col md={12} lg={6} xl={6}>
                <div className={`${lx.currentProgress} ${lx.currentShodow} mt-4`}>
                  <div className={`${lx.currentBox}`}>
                    <h4>Continue Where You Left Off</h4>
                    <p>
                      You’re in the middle of your simulation! Pick up where you
                      left off below and complete the next step.
                    </p>

                    <div className={`${lx.teamChart}`}>
                      <ul>
                        {items?.map((item: any, index: number) => {
                          return item?.addNewStepButtons[0]?.steps?.map(
                            (e: any, num: number) => {
                              return e?.actions?.map(
                                (a: any, number: number) => {
                                  if (a?.disable == 0) {
                                    return (
                                      <li
                                        className={
                                          actionPending?.id === a?.id
                                            ? ""
                                            : `${lx.link_list}`
                                        }
                                        onClick={() => {
                                          if (actionPending?.id === a?.id) {
                                            dispatch(changeDivUrl(e?.id));
                                            history.push(
                                              `/participant/simulations/${simulationId}`
                                            );
                                          }
                                        }}
                                      >
                                        <h6>
                                          {item?.title || item?.content}
                                          <p>
                                            {e?.title || e?.content} -{" "}
                                            {a?.actionValue}
                                          </p>
                                        </h6>
                                        <NavLink
                                          to="#"
                                          className={
                                            actionPending?.id === a?.id
                                              ? `${lx.link_btn_active}`
                                              : `${lx.link_btn}`
                                          }
                                        >
                                          In Progress
                                        </NavLink>
                                      </li>
                                    );
                                  }
                                }
                              );
                            }
                          );
                        })}
                      </ul>
                    </div>
                    <div
                      className={`${lx.link_simulation}`}
                      onClick={() => {
                        let length = actionPending.id?.indexOf("a");
                        let id = actionPending?.id?.slice(0, length);
                        dispatch(changeDivUrl(id));
                        history.push(
                          `/participant/simulations/${simulationId}`
                        );
                      }}
                    >
                      <NavLink to="#">Enter Simulation</NavLink>
                    </div>
                  </div>
                </div>
              </Col>
            )}

            <Col md={12} lg={6} xl={6}>
              <div className={`${lx.currentProgress} mt-4`}>
                <div className={`${lx.currentBox}`}>
                  <div className={`${lx.feedbackSection}`}>
                    <h4>Submissions Pending Feedback</h4>
                    <NavLink
                      to={`/participant/feedback/${simulationId}`}
                      className={`${lx.link_btn_active}`}
                    >
                      View details
                    </NavLink>
                  </div>

                  <div className={`${lx.teamChart}`}>
                    <div className={`${lx.titleHeading}`}>
                      <h6>Task Name</h6>
                      <h6>Date Submitted</h6>
                      <h6>Feedback Status</h6>
                    </div>
                    {feedbackList?.map((item: any, index: number) => {
                      let date = new Date(item.col3).toLocaleString("en-us", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <div
                          className={`${lx.titleHeading}`}
                          onClick={() => {
                            dispatch(changeDivUrl(item?.col5));
                            history.push(
                              `/participant/feedback/${simulationId}`
                            );
                          }}
                        >
                          <p>{item?.col2}</p>
                          <p>
                            <span> {date}</span>
                          </p>
                          <NavLink
                            to="#"
                            className={
                              item?.col4 === "Completed"
                                ? `${lx.link_green}`
                                : `${lx.link_yellow}`
                            }
                          >
                            {item?.col4}
                          </NavLink>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      <Footer />

      <Modal
        className={`${lx.modalFeedbacks}`}
        size="xl"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className={`col-lg-12 mb-0 ${cx.formBox}`}
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Evaluation of Simulation</Form.Label>
            <div className={`${lx.feedbackOverall}`}>
              <p className="mb-0">
                <b> 1. Learning and Preparation: </b> How would you evaluate the
                simulation on contributing to your learning and preparomg you
                for your new role?
              </p>
              <div className={`${lx.feedbackNumber}`}>
                <ul>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncOne(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={1}
                      className={rateOne === 1 ? `active` : ""}
                    >
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncOne(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={2}
                      className={rateOne === 2 ? `active` : ""}
                    >
                      2
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncOne(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={3}
                      className={rateOne === 3 ? `active` : ""}
                    >
                      3
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncOne(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={4}
                      className={rateOne === 4 ? `active` : ""}
                    >
                      4
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncOne(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={5}
                      className={rateOne === 5 ? `active` : ""}
                    >
                      5
                    </button>
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

            <div className={`${lx.feedbackOverall}`}>
              <p className="mb-0">
                <b> 2. Difficulty of simulation: </b> How would you evaluate the
                difficulty level of the simulation—was it appropriate for your
                level amd skillset?
              </p>
              <div className={`${lx.feedbackNumber}`}>
                <ul>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncTwo(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={1}
                      className={rateTwo === 1 ? `active` : ""}
                    >
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncTwo(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={2}
                      className={rateTwo === 2 ? `active` : ""}
                    >
                      2
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncTwo(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={3}
                      className={rateTwo === 3 ? `active` : ""}
                    >
                      3
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncTwo(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={4}
                      className={rateTwo === 4 ? `active` : ""}
                    >
                      4
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncTwo(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={5}
                      className={rateTwo === 5 ? `active` : ""}
                    >
                      5
                    </button>
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

            <div className={`${lx.feedbackOverall}`}>
              <p className="mb-0">
                <b> 3. Time to complete: </b> How would you evaluate the time
                spent to complete the simulation?
              </p>
              <div className={`${lx.feedbackNumber}`}>
                <ul>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncThree(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={1}
                      className={rateThree === 1 ? `active` : ""}
                    >
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncThree(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={2}
                      className={rateThree === 2 ? `active` : ""}
                    >
                      2
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncThree(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={3}
                      className={rateThree === 3 ? `active` : ""}
                    >
                      3
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncThree(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={4}
                      className={rateThree === 4 ? `active` : ""}
                    >
                      4
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e: any) => rateFuncThree(+e.target.value)}
                      disabled={verify == "true" ? true : false}
                      value={5}
                      className={rateThree === 5 ? `active` : ""}
                    >
                      5
                    </button>
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

            <div className={`${lx.feedbackOverall} d-block`}>
              <p>
                <b> Please add any additional comments here: </b>
              </p>
              <textarea
                className="form-control"
                defaultValue={feedText}
                disabled={verify == "true" ? true : false}
                onChange={(e: any) => setFeedText(e.target.value)}
              ></textarea>
            </div>

            <Col lg={12} className="text-center">
              <button
                className={`${lx.submitBtn} btn`}
                disabled={verify == "true" ? true : false}
                onClick={addFeedStudent}
              >
                Submit Feedback
              </button>
            </Col>
          </Form.Group>
        </Modal.Body>
      </Modal>

      <Modal className={`${lx.modalFeedbacks}`} size="xl" show={showc1}>
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className={`col-lg-12 mb-0 ${lx.congratulationsFull}`}
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label className={`text-center w-100`}>
              Final action items to complete
            </Form.Label>
            <div className={`${lx.congratulationsBox}`}>
              <Row>
                <Col
                  md={4}
                  onClick={() => {
                    handlec1Close();
                    history.push(`/participant/resource/${simulationId}`);
                  }}
                >
                  <div className={`${lx.visitBox}`}>
                    <h4>Visit the resource bank</h4>
                    <p>
                      This contains all the resources you used throughout the
                      simulation
                    </p>
                    <div className={`text-center`}>
                      <img src="../../../images/books.svg" alt="" />
                    </div>
                  </div>
                </Col>
                <Col
                  md={4}
                  onClick={() => {
                    handlec1Close();
                    handleShow();
                  }}
                >
                  <div className={`${lx.visitBox}`}>
                    <h4>Fill out the simulation evaluation</h4>
                    <p>
                      Please help us improve the simulatiom for future hires!
                    </p>
                    <div className={`text-center`}>
                      <img src="../../../images/megaphone.svg" alt="" />
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className={`${lx.visitBox}`}>
                    <h4>Learn more about First90 Training</h4>
                    <p>
                      Check us out at first90.io and subscribe to our mailing
                      list!
                    </p>
                    <div className={`text-center`}>
                      <img src="../../../images/hand_sign.svg" alt="" />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <Col lg={12} className="text-center">
              <button className={`${lx.submitBtn} btn`} onClick={handlec1Close}>
                Return to Dashboard
              </button>
            </Col>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DashboardParticipant;
