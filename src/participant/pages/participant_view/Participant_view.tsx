import React, { useEffect } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from "../../../admin.style.module.scss";
import lx from "./Participant_view.module.scss";
import { useState } from "react";
import { NavLink, Prompt, useHistory, useParams } from "react-router-dom";
import RightSidebar from "../../../components/right-sidebar/right-sidebar";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import { FiDownloadCloud, FiLink } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";

import { HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import { MdCall } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { BiText } from "react-icons/bi";
import { BiImageAlt } from "react-icons/bi";
import { BsLink } from "react-icons/bs";
import { ImEmbed2 } from "react-icons/im";
import Sidebar from "../../../components/sidebar/Sidebar";
import Simulationmenu from "../../../components/simulationmenuparticipent/Simulationmenu";
import useHttp from "../../../hooks/use-https";
import { useSelector } from "react-redux";
import UploadFileAction from "../../../admin/pages/participant_view/actions/UploadFileAction";
import ScheduleLiveAction from "../../../admin/pages/participant_view/actions/ScheduleLiveAction";
import WriteEmailAction from "../../../admin/pages/participant_view/actions/WriteEmailAction";
import EmbeddedImage from "../../../admin/pages/participant_view/actions/EmbeddedImage";
import QandAAction from "../../../admin/pages/participant_view/actions/QandAAction";
import EmbeddedVideoAction from "../../../admin/pages/participant_view/actions/EmbeddedVideoAction";
import DownloadFileAction from "../../../admin/pages/participant_view/actions/DownloadFileAction";
import AddText from "../../../admin/pages/participant_view/actions/AddText";
import ReadEmailAction from "../../../admin/pages/participant_view/actions/ReadEmailAction";
import WebLink from "../../../admin/pages/participant_view/actions/WebLink";
import { useDispatch } from "react-redux";
import {
  changeApiButtonStatus,
  changeDivUrl,
  changeGlobalResourceValue,
  changeModuleArrayValue,
  changeModuleCount,
  changeSidebar,
  changeStepValue,
  moduleArray,
  sendToNextStep,
  simulationIdGet,
  teamName,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { toast } from "react-toastify";

const ParticipantView = (props: any) => {
  const urlChange = useSelector(
    (state: any) => state.moduleButtonReducer.value
  );
  const runSidebar = useSelector((state: any) => state.moduleButtonReducer);
  const notify = (text: string) =>
    toast(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const history = useHistory();
  const param: any = useParams();
  let loginData = localStorage.getItem("data")!;
  let localLoginData = JSON.parse(loginData)!;

  const dispatch = useDispatch();
  const [simulationData, setSimulationData] = useState<any>();
  const [simulationId, setSimulationId] = useState<string>("");
  const [actionPending, setActionPending] = useState<any>();
  const [startTime, setStartTime] = useState<number>(0);
  const [nextStep, setNextStep] = useState<number>(0);
  const [simulationName, setSimulationName] = useState<string>("");
  const { sendRequest } = useHttp();
  const { sendRequest: updateSimulationRequest } = useHttp();
  const { sendRequest: stepPerSec } = useHttp();
  const { sendRequest: notificationRequest } = useHttp();

  useEffect(() => {
    let time = Date.now();
    setStartTime(time);
  }, []);

  const getPerStepTime = (responseData: any) => {
    setStartTime(Date.now());
  };

  const addPerStepTime = () => {
    let endTime = Date.now();
    let differences = endTime - startTime;
    let data = JSON.stringify({
      simulation_id: simulationId,
      student_id: localLoginData?._id,
      team_id: param?.id,
      module_id: modId,
      stap_id: stId,
      time: `${differences}`,
      stepName: stepName,
    });
    stepPerSec(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/addSimulation_time`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      getPerStepTime
    );
  };

  const getSimulationDataResponse = (responseData: any) => {
    setSimulationName(responseData?.data?.addSimulation?.NameOfSimulation);
    setSimulationId(responseData.data?.addSimulation?._id);
    dispatch(simulationIdGet(param.id));
    dispatch(
      changeModuleArrayValue(responseData.data?.Simulation?.AddallModule)
    );
    dispatch(
      changeModuleCount(responseData.data?.Simulation?.AddallModule?.length)
    );
    dispatch(
      changeGlobalResourceValue({
        global: responseData.data?.Simulation?.globalResourceArray,
      })
    );
  };

  const getSimulationData = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/student_simulation?team_id=${param?.id}&student_id=${localLoginData?._id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      getSimulationDataResponse
    );
  };
  let modId = "";
  let stId = "";
  let stepName = "";
  let modIndex = 0;
  let stepIndex = 0;
  useEffect(() => {
    getSimulationData();
  }, []);

  useEffect(() => {
    setSimulationData(moduleArray);
  }, [moduleArray]);

  useEffect(() => {
    if (runSidebar.runSidebar > 0) {
      notify(
        `Please submit all the action of ${
          simulationData[modIndex]?.addNewStepButtons[0].steps[stepIndex]
            .title ||
          simulationData[modIndex]?.addNewStepButtons[0].steps[stepIndex]
            .content
        } first`
      );
      dispatch(changeSidebar());
    }
  }, [runSidebar.runSidebar]);

  useEffect(() => {
    if (simulationData != undefined) {
      let pendingAction: any;
      simulationData?.map((e: any) => {
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
      if (pendingAction != undefined) {
        let length = pendingAction.id?.indexOf("a");
        let id = pendingAction?.id?.slice(0, length);
        dispatch(changeDivUrl(id));
      } else {
        dispatch(
          changeDivUrl(
            simulationData[simulationData?.length - 1]?.addNewStepButtons[0]
              ?.steps[
              simulationData[simulationData?.length - 1]?.addNewStepButtons[0]
                ?.steps?.length - 1
            ]?.id
          )
        );
      }
      setSimulationData(simulationData);
    }
  }, [simulationData]);

  useEffect(() => {
    let actionData: any[] = [];
    simulationData?.map((item: any) => {
      item?.addNewStepButtons[0]?.steps?.map((e: any) => {
        e?.actions?.map((a: any) => {
          actionData.push(a);
        });
      });
    });
    let halfLength = Math.ceil(actionData.length / 2);
    if (
      actionData[halfLength - 1]?.disable === 1 &&
      actionData[halfLength]?.disable === 0
    ) {
      notificationHandler(
        `${teamName} has just passed the halfway mark of “${simulationName}”!`
      );
      notificationHandler(
        `You just reached the halfway point of “${simulationName}” - keep up the great work! (once half of the actions have been completed)`
      );
    }
  }, [simulationData, nextStep]);

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

  window.onbeforeunload = function () {
    simulationData?.map((item: any) => {
      if (item?.id === modId) {
        item.addNewStepButtons[0].steps.map((e: any, num: number) => {
          if (e?.id === stId) {
            if (e.apiButton === 0) {
              addPerStepTime();
            }
          }
        });
      }
    });
    return "Data will be lost if you leave the page, are you sure?";
  };

  const [stopPropmt, setStopPrompt] = useState(false);
  function promptStop(bool: boolean) {
    simulationData?.map((item: any) => {
      if (item?.id === modId) {
        item.addNewStepButtons[0].steps.map((e: any, num: number) => {
          if (e?.id === stId) {
            if (e.apiButton === 0) {
              addPerStepTime();
            }
          }
        });
      }
    });
    setStopPrompt(bool);
  }

  const notificationResponse = (responseData: any) => {
    console.log(responseData, "notificationData");
  };

  const notificationHandler = (msg: string) => {
    let data = {
      message: msg,
      teamId: param?.id,
      type: "team",
    };

    notificationRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/teamnotifications`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      notificationResponse
    );
  };

  function sendNotification() {
    let pendingAction: any;
    simulationData?.map((e: any) => {
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
    const data =
      simulationData[simulationData.length - 1].addNewStepButtons[0].steps[
        simulationData[simulationData.length - 1].addNewStepButtons[0].steps
          .length - 1
      ].actions;
    if (data.every((a: any) => a.disable === 1)) {
      notificationHandler(
        `${teamName} has just completed “${simulationName}”!`
      );
      notificationHandler(
        `Congratulations on completing your simulation! Please fill out the feedback survey to help us improve the experience for your colleagues.`
      );
    }
  }

  return (
    <>
      <Prompt
        when={stopPropmt}
        message={(location, action): any => {
          if (action === "POP") {
            console.log("Backing up...");
          }
          return location.pathname.startsWith("/app")
            ? true
            : `Are you sure you want to go to ${location.pathname}?`;
        }}
      />
      <Header title="Onboarding Simulation" btnStatus="view-paricipant" />
      <Sidebar
        onmouseup={() => {
          promptStop(true);
        }}
      />
      <section
        className={`${cx.pageWrapper}`}
        onClick={() => {
          promptStop(false);
        }}
      >
        <Row>
          <Simulationmenu simulationData={simulationData} />
          <Col lg={6}>
            {simulationData?.map((val: any, index: number) => {
              return val.addNewStepButtons[0].steps.map(
                (e: any, num: number) => {
                  if (e.id == urlChange) {
                    if (e?.resourceNotify === true && e?.ResourceCount > 0) {
                      notificationHandler(
                        `You have unlocked ${e?.ResourceCount} new resources`
                      );
                      e.resourceNotify = false;
                      updateSimulation();
                    }
                    return (
                      (modId = val.id),
                      (stId = e.id),
                      (stepName = e?.title || e?.content),
                      (modIndex = index),
                      (stepIndex = num),
                      (
                        <>
                          <Card className={`${lx.disabled}`}>
                            <Card.Body>
                              <Card.Text>
                                <Form className="row">
                                  <Form.Group
                                    className={`col-lg-12 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <h4>{val?.title || val?.content}</h4>
                                    <p>{val?.description}</p>
                                  </Form.Group>
                                  <Form.Group
                                    className={`col-lg-12 mb-0 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <h4>{e?.title || e?.content}</h4>
                                    <p className="m-0">{e?.description}</p>
                                  </Form.Group>
                                </Form>
                              </Card.Text>
                            </Card.Body>
                          </Card>

                          {e.actions.map((value: any, index: number) => {
                            if (value.actionValue == "Web Link") {
                              return (
                                <WebLink
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                  sendNotification={sendNotification}
                                />
                              );
                            } else if (value.actionValue == "Read an Email") {
                              return (
                                <ReadEmailAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                />
                              );
                            } else if (value.actionValue == "Add Text") {
                              return (
                                <AddText
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                />
                              );
                            } else if (value.actionValue == "Download a File") {
                              return (
                                <DownloadFileAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                />
                              );
                            } else if (value.actionValue == "Write an Email") {
                              return (
                                <WriteEmailAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                  sendNotification={sendNotification}
                                />
                              );
                            } else if (value.actionValue == "Embeded Video") {
                              return (
                                <EmbeddedVideoAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                />
                              );
                            } else if (
                              value.actionValue == "Question and Answer"
                            ) {
                              return (
                                <QandAAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                  sendNotification={sendNotification}
                                />
                              );
                            } else if (value.actionValue == "Embeded Image") {
                              return (
                                <EmbeddedImage
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                />
                              );
                            } else if (
                              value.actionValue ==
                              "Schedule a Live Conversation"
                            ) {
                              return (
                                <ScheduleLiveAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                  sendNotification={sendNotification}
                                />
                              );
                            } else if (value.actionValue == "Upload a File") {
                              return (
                                <UploadFileAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                  simulationId={simulationId}
                                  sendNotification={sendNotification}
                                />
                              );
                            }
                          })}
                        </>
                      )
                    );
                  }
                }
              );
            })}
            <Col className={`text-end mb-3 ${cx.submitActionBox}`}>
              <button
                className={`btn ${cx.submitBtn}`}
                onClick={() => {
                  if (simulationData != undefined) {
                    if (
                      actionPending == undefined &&
                      urlChange ==
                        simulationData[simulationData?.length - 1]
                          ?.addNewStepButtons[0]?.steps[
                          simulationData[simulationData?.length - 1]
                            ?.addNewStepButtons[0]?.steps?.length - 1
                        ]?.id
                    ) {
                      addPerStepTime();
                      simulationData[simulationData.length - 1].addNewStepButtons[0].steps[
                        simulationData[simulationData.length - 1].addNewStepButtons[0].steps
                          .length - 1
                      ].apiButton = 1
                      updateSimulation();
                      history.push(`/participant/dashboard/${param?.id}`);
                    } else {
                      setNextStep(nextStep + 1);
                      dispatch(
                        sendToNextStep({
                          mid:
                            stepIndex ===
                            simulationData[modIndex]?.addNewStepButtons[0].steps
                              .length -
                              1
                              ? modIndex + 1
                              : modIndex,
                          sid:
                            stepIndex ===
                            simulationData[modIndex]?.addNewStepButtons[0].steps
                              .length -
                              1
                              ? 0
                              : stepIndex + 1,
                        })
                      );

                      if (
                        simulationData[
                          stepIndex ===
                          simulationData[modIndex]?.addNewStepButtons[0].steps
                            .length -
                            1
                            ? modIndex + 1
                            : modIndex
                        ]?.addNewStepButtons[0].steps[
                          stepIndex ===
                          simulationData[modIndex]?.addNewStepButtons[0].steps
                            .length -
                            1
                            ? 0
                            : stepIndex + 1
                        ]?.disabled === false
                      ) {
                        simulationData?.map((item: any) => {
                          if (item?.id === modId) {
                            item.addNewStepButtons[0].steps.map(
                              (e: any, num: number) => {
                                if (e?.id === stId) {
                                  if (e.apiButton === 0) {
                                    addPerStepTime();
                                    e.apiButton = e.apiButton + 1;
                                    updateSimulation();
                                  }
                                }
                              }
                            );
                          }
                        });
                        dispatch(
                          changeStepValue(
                            simulationData[
                              stepIndex ===
                              simulationData[modIndex]?.addNewStepButtons[0]
                                .steps.length -
                                1
                                ? modIndex + 1
                                : modIndex
                            ]?.addNewStepButtons[0].steps[
                              stepIndex ===
                              simulationData[modIndex]?.addNewStepButtons[0]
                                .steps.length -
                                1
                                ? 0
                                : stepIndex + 1
                            ]
                          )
                        );
                        dispatch(
                          changeDivUrl(
                            simulationData[
                              stepIndex ===
                              simulationData[modIndex]?.addNewStepButtons[0]
                                .steps.length -
                                1
                                ? modIndex + 1
                                : modIndex
                            ]?.addNewStepButtons[0].steps[
                              stepIndex ===
                              simulationData[modIndex]?.addNewStepButtons[0]
                                .steps.length -
                                1
                                ? 0
                                : stepIndex + 1
                            ]?.id
                          )
                        );
                      }
                    }
                  }
                }}
              >
                {simulationData != undefined &&
                urlChange ==
                  simulationData[simulationData?.length - 1]
                    ?.addNewStepButtons[0]?.steps[
                    simulationData[simulationData?.length - 1]
                      ?.addNewStepButtons[0]?.steps?.length - 1
                  ]?.id
                  ? "Go To Dashboard"
                  : "Continue to Next Step"}
              </button>
            </Col>
          </Col>

          <RightSidebar
            btnStatus={false}
            id={simulationId}
            mid={modId}
            sid={stId}
          />
        </Row>
      </section>
      <Footer />
    </>
  );
};

export default ParticipantView;
