import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./Dashboard.module.scss";
// import { useState } from "react";
// import { AiOutlineCloudDownload } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import Bar from "./BarChart";
import Chart from "./SquareChart";
import RectangleChart from "./RectangleChart";
import ProgressBar from "react-bootstrap/ProgressBar";
import graphImages from "../../../images/pr.svg";

import { Card, Col, Row, Form, OverlayTrigger } from "react-bootstrap";

import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { NavLink, useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-https";
import {
  changeModuleArrayValue,
  feedbackTeamName,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";

const percentage = 33;

const DashboardAdmin = (props: any) => {
  const { sendRequest } = useHttp();
  const { sendRequest: timeRequest } = useHttp();
  const { sendRequest: evalutionRequest } = useHttp();

  const [totalStep, setTotalStep] = useState<number>(0);
  const [completedStep, setCompletedStep] = useState<number>(0);
  const [feedbackDone, setFeedbackDone] = useState<number>(0);
  const [submittedAction, setSubmittedAction] = useState<number>(0);
  const [perSimulationTeams, setPerSimulationTeams] = useState<any[]>([]);
  const [dateForStep, setDateForStep] = useState<any[]>([]);
  const [timeForStep, setTimeForStep] = useState<any[]>([]);
  const [timeForStepSimulation, setTimeForStepSimulation] = useState<any[]>([]);
  const [dateForStepSimulation, setDateForStepSimulation] = useState<any[]>([]);
  const [value, setValue] = useState<any[]>([]);
  const [feedbackValue, setFeedbackValue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [select, setSelect] = useState("All Teams");
  const [criteria, setCriteria] = useState<any[]>([]);
  const [studentRating, setStudentRating] = useState<any[]>([]);
  const [studentRatingLength, setStudentRatingLength] = useState<number>(0);

  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    allTeam();
    getEvalution();
  }, []);

  useEffect(() => {
    getTime();
  }, [completedStep]);

  const getTeam = (data: any) => {
    let completedStep = 0;
    let totalStep = 0;
    let completedAction = 0;
    let feedbackSubmittedCount = 0;
    let teamArr: any[] = [];
    data?.data?.map((item: any) => {
      item?.Simulation?.AddallModule?.map((e: any) => {
        e?.addNewStepButtons[0]?.steps?.map((a: any) => {
          a?.actions?.map((z: any) => {
            if (
              z.actionValue == "Upload a File" ||
              z.actionValue == "Write an Email" ||
              z.actionValue == "Question and Answer" ||
              (z.actionValue == "Schedule a Live Conversation" &&
                z?.disable === 1)
            ) {
              completedAction += 1;
            }
            if (z.feedResourceByCoachCount === 1) {
              feedbackSubmittedCount += 1;
            }
          });
          if (a?.apiButton === 1) {
            completedStep += 1;
            totalStep += 1;
          } else {
            totalStep += 1;
          }
        });
        if (
          e?.addNewStepButtons[0]?.steps?.some((a: any) => a?.apiButton === 0)
        ) {
          if (teamArr.length > 0) {
            for (let i = 0; i < teamArr.length; i++) {
              if (teamArr.some((a: any) => a.id === item?.addSimulation?._id)) {
                teamArr?.map((s: any) => {
                  if (s.id === item?.addSimulation?._id) {
                    s.teams = s.teams + 1;
                    s.content = `teams: ${s.teams}`;
                  }
                });
              } else {
                teamArr.push({
                  id: item?.addSimulation?._id,
                  name: item?.addSimulation?.NameOfSimulation,
                  teams: 1,
                  content: "team: 1",
                });
              }
            }
          } else {
            teamArr.push({
              id: item?.addSimulation?._id,
              name: item?.addSimulation?.NameOfSimulation,
              teams: 1,
              content: "team: 1",
            });
          }
        }
      });
    });
    setTotalStep(totalStep);
    setCompletedStep(completedStep);
    setSubmittedAction(completedAction);
    setFeedbackDone(feedbackSubmittedCount);
    setPerSimulationTeams(teamArr);
    const criteriaGraph: any[] = [];
    const perActionData: any[] = [];
    data?.data?.map((item: any) => {
      item?.Simulation?.AddallModule?.map((e: any) => {
        if (e?.addNewStepButtons) {
          e?.addNewStepButtons[0]?.steps?.map((a: any) => {
            a?.actions?.map((z: any, index: number) => {
              criteriaGraph.push(z?.feedback);
              if (z?.content?.submitTime && z.content.submitTime !== "") {
                perActionData.push({
                  col1: `${index + 1}`,
                  col2: item?.Simulation?.NameOfSimulation,
                  col3: z?.actionValue,
                  col4: item?.teamName,
                  col5: z.content.submitTime,
                  col6: z.content.completeStatus,
                  col7: z.id,
                  col8: item?.Simulation?.AddallModule,
                  col9: item?._id,
                });
              }
            });
          });
        }
      });
    });
    let ascending = perActionData.sort(
      (a, b) => Number(a.col5) - Number(b.col5)
    );
    setFeedbackValue(ascending);
    setValue(ascending);
    setLoading(false);
    let criteriaRate: any[] = [];
    criteriaGraph?.flat(Infinity)?.map((item: any) => {
      if (item?.feedbackRating > 0) {
        if (criteriaRate.length > 0) {
          for (let i = 0; i < teamArr.length; i++) {
            if (criteriaRate.some((a: any) => a.title === item?.title)) {
              criteriaRate?.map((s: any) => {
                if (s.title === item?.title) {
                  s.feedbackRating =
                    (s.feedbackRating + item?.feedbackRating) / (s.count + 1);
                  s.count = s.count + 1;
                }
              });
            } else {
              criteriaRate.push({
                title: item?.title,
                feedbackRating: item?.feedbackRating,
                count: 1,
              });
            }
          }
        } else {
          criteriaRate.push({
            title: item?.title,
            feedbackRating: item?.feedbackRating,
            count: 1,
          });
        }
      }
    });
    setCriteria(criteriaRate);
    const team: any[] = [];
    data?.data?.map((item: any, index: number) => {
      let completedStep = 0;
      let totalStep = 0;
      item?.Simulation?.AddallModule?.map((e: any) => {
        e?.addNewStepButtons[0]?.steps?.map((a: any) => {
          if (a?.apiButton === 1) {
            completedStep += 1;
            totalStep += 1;
          } else {
            totalStep += 1;
          }
        });
      });
      team.push({
        id: index,
        col1: `${index + 1}`,
        col2: item?.Simulation?.NameOfSimulation,
        col3: item?.teamName,
        col4: item?.students?.map(
          (party: any) => `${party.firstName} ${party.lastName}`
        ),
        col5: Math.round((completedStep / totalStep) * 100),
        col6: item?.addSimulation,
      });
    });
    setTeamData(team);
    setTeamLoading(false);
  };

  const allTeam = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getTeam`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeam
    );
  };

  const getTeamResponse = (data: any) => {
    let time: number = 0;
    let simulationList: any[] = [];
    let timePerParticipant: any[] = [];
    data?.data?.forEach((item: any, index: number) => {
      time += item?.time;
      if (simulationList?.length > 0) {
        for (let i = 0; i < simulationList?.length; i++) {
          if (
            simulationList.some((a: any) => a.id === item?.simulation_id?._id)
          ) {
            simulationList?.map((s: any) => {
              if (s.id === item?.simulation_id?._id) {
                s.time = s.time + item?.time;
              }
            });
          } else {
            simulationList.push({
              id: item?.simulation_id?._id,
              time: item?.time,
            });
          }
        }
      } else {
        simulationList.push({
          id: item?.simulation_id?._id,
          time: item?.time,
        });
      }
      if (timePerParticipant?.length > 0) {
        for (let i = 0; i < timePerParticipant?.length; i++) {
          if (
            timePerParticipant.some(
              (a: any) =>
                a.col1 === item?.team_id?.teamName &&
                a.col2 ===
                  item?.student_id?.firstName +
                    " " +
                    item?.student_id?.lastName &&
                a.col3 === item?.simulation_id?.NameOfSimulation &&
                a.col4 === item?.stap_id
            )
          ) {
            timePerParticipant?.map((s: any) => {
              let name =
                item?.student_id?.firstName + " " + item?.student_id?.lastName;
              if (
                s.id === item?._id &&
                s.col1 === item?.team_id?.teamName &&
                s.col2 === name &&
                s.col3 === item?.simulation_id?.NameOfSimulation &&
                s.col4 === item?.stap_id
              ) {
                s.col6 = s.col6 + item?.time;
                let check = new Date(s.col6).toISOString();
                let dateCheck = check.split("T");
                let dateSepratedCheck = dateCheck[0].split("-");
                let timeSepratedCheck = dateCheck[1].split(":");
                let year =
                  +dateSepratedCheck[0] - 1970 > 0
                    ? `${+dateSepratedCheck[2] - 1970} Years`
                    : "";
                let month =
                  +dateSepratedCheck[2] - 1 > 0
                    ? `${dateSepratedCheck[0]} Months`
                    : "";
                let day =
                  +dateSepratedCheck[1] - 1 > 0
                    ? `${dateSepratedCheck[1]} Days`
                    : "";
                let hour =
                  timeSepratedCheck[0] != "00"
                    ? `${timeSepratedCheck[0]} Hours`
                    : "";
                let minute =
                  timeSepratedCheck[1] != "00"
                    ? `${timeSepratedCheck[1]} Minutes`
                    : "";
                s.col5 = `${year} ${month} ${day} ${hour} ${minute}`.trim();
              }
            });
          } else {
            let check = new Date(item?.time).toISOString();
            let dateCheck = check.split("T");
            let dateSepratedCheck = dateCheck[0].split("-");
            let timeSepratedCheck = dateCheck[1].split(":");
            let year =
              +dateSepratedCheck[0] - 1970 > 0
                ? `${+dateSepratedCheck[2] - 1970} Years`
                : "";
            let month =
              +dateSepratedCheck[2] - 1 > 0
                ? `${dateSepratedCheck[0]} Months`
                : "";
            let day =
              +dateSepratedCheck[1] - 1 > 0
                ? `${dateSepratedCheck[1]} Days`
                : "";
            let hour =
              timeSepratedCheck[0] != "00"
                ? `${timeSepratedCheck[0]} Hours`
                : "";
            let minute =
              timeSepratedCheck[1] != "00"
                ? `${timeSepratedCheck[1]} Minutes`
                : "";
            let allTime = `${year} ${month} ${day} ${hour} ${minute}`;
            timePerParticipant.push({
              id: item?._id,
              col1: item?.team_id?.teamName,
              col2:
                item?.student_id?.firstName + " " + item?.student_id?.lastName,
              col3: item?.simulation_id?.NameOfSimulation,
              col4: item?.stap_id,
              col5: allTime.trim(),
              col6: item?.time,
            });
          }
        }
      } else {
        let check = new Date(item?.time).toISOString();
        let dateCheck = check.split("T");
        let dateSepratedCheck = dateCheck[0].split("-");
        let timeSepratedCheck = dateCheck[1].split(":");
        let year =
          +dateSepratedCheck[0] - 1970 > 0
            ? `${+dateSepratedCheck[2] - 1970} Years`
            : "";
        let month =
          +dateSepratedCheck[2] - 1 > 0 ? `${dateSepratedCheck[0]} Months` : "";
        let day =
          +dateSepratedCheck[1] - 1 > 0 ? `${dateSepratedCheck[1]} Days` : "";
        let hour =
          timeSepratedCheck[0] != "00" ? `${timeSepratedCheck[0]} Hours` : "";
        let minute =
          timeSepratedCheck[1] != "00" ? `${timeSepratedCheck[1]} Minutes` : "";
        let allTime = `${year} ${month} ${day} ${hour} ${minute}`;
        timePerParticipant.push({
          id: item?._id,
          col1: item?.team_id?.teamName,
          col2: item?.student_id?.firstName + " " + item?.student_id?.lastName,
          col3: item?.simulation_id?.NameOfSimulation,
          col4: item?.stap_id,
          col5: allTime.trim(),
          col6: item?.time,
        });
      }
    });
    let stepTime: number = 0;
    timePerParticipant?.map((item: any) => {
      stepTime += item.col6;
    });
    let averageTimeInMS = stepTime / timePerParticipant?.length;
    let check = new Date(averageTimeInMS).toISOString();
    let dateAndTime = check.split("T");
    let dateSeprated = dateAndTime[0].split("-");
    let timeSeprated = dateAndTime[1].split(":");
    setDateForStep(dateSeprated);
    setTimeForStep(timeSeprated);
    let simulationTime: number = 0;
    simulationList?.map((item: any) => {
      simulationTime += item?.time;
    });
    let averageSimulationTime = stepTime / simulationList?.length;
    let checkSimulationTime = new Date(averageSimulationTime).toISOString();
    let dateAndTimeSimulation = checkSimulationTime.split("T");
    let dateSepratedSimulation = dateAndTimeSimulation[0].split("-");
    let timeSepratedSimulation = dateAndTimeSimulation[1].split(":");
    setDateForStepSimulation(dateSepratedSimulation);
    setTimeForStepSimulation(timeSepratedSimulation);
  };

  const getTime = () => {
    timeRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getSimulation_time`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeamResponse
    );
  };

  useEffect(() => {
    if (select !== "All Teams") {
      const data: any[] = [];
      feedbackValue?.map((item: any) => {
        if (select === item?.col4) {
          data.push(item);
        }
      });
      setValue(data);
    } else {
      setValue(feedbackValue);
    }
  }, [select]);

  const onRowClicked = (row: any) => {
    history.push(`/admin/feedback-details/${row.col7}`);
    dispatch(changeModuleArrayValue(row.col8));
    dispatch(feedbackTeamName([row.col4, row.col9]));
    localStorage.setItem("teamId", JSON.stringify(row.col9));
  };
  const onTeamRowClicked = (row: any) => {
    history.push(`/admin/manage-team/${row.col6?._id}`);
  };

  const getEvalutionResponse = (data: any) => {
    let rateData: any[] = [
      {
        name: "Effectiveness of Learning",
        type: 0,
      },
      {
        name: "Difficulty of Simulation",
        type: 0,
      },
      {
        name: "Time to Complete",
        type: 0,
      },
    ];
    let length: number = 0;
    data?.data?.forEach((item: any, index: number) => {
      rateData[0].type += item?.type1;
      rateData[1].type += item?.type2;
      rateData[2].type += item?.type3;
      length = index + 1;
    });
    rateData?.map((item: any) => {
      item.type = item.type / length;
    });
    setStudentRating(rateData);
    setStudentRatingLength(length);
  };
  const getEvalution = () => {
    evalutionRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getevalutionOfSimulation`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getEvalutionResponse
    );
  };

  return (
    <>
      <Header title="Dashboard" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Row>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/admin/simulation`}
                  style={{ textDecoration: "none", color: "#4338ca" }}
                >
                  <h5>Edit My Draft Simulations</h5>
                  <FiEdit2 className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/admin/create-simulation`}
                  style={{ textDecoration: "none", color: "#4338ca" }}
                >
                  <h5>Create a New Simulation</h5>
                  <FiUsers className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/admin/create-team`}
                  style={{ textDecoration: "none", color: "#4338ca" }}
                >
                  <h5>Create a New Team</h5>
                  <FiPlusSquare className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to={`/admin/simulation`}
                  style={{ textDecoration: "none", color: "#4338ca" }}
                >
                  <h5>Make a Copy of a Simulation</h5>
                  <MdContentCopy className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
          </Row>

          <Card.Title className="mt-4">Progress Report</Card.Title>
          <Row>
            {/* <Col md={12} lg={4} xl={4}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3">Performance of All Teams</h4>
                  <Col lg={12} className="text-center">
                    <h5>Demo</h5>
                  </Col>
                  <div className={`${lx.graphInBody}`} style={{ fontSize: '12px' }}>
                    <HorizontalBar />
                  </div>
                </div>
              </div>
            </Col> */}

            <Col md={12} lg={4} xl={4}>
              <div className={`${lx.currentProgresstop}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3">Performance of All Teams</h4>
                  <Col lg={12} className="text-center">
                    <h5>Participant Scoring on Submissions</h5>
                  </Col>
                  <div className={`${lx.squareChart}`}>
                    <Bar criteria={criteria} />
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12} lg={4} xl={4}>
              <div className={`${lx.currentProgresstop}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3">Progress of Current Teams</h4>
                  <div className={`${lx.graphInBody}`}>
                    <Row>
                      <Col md={6} lg={6} xl={6}>
                        <div className={`${lx.prtGraph}`}>
                          <h5>Average Progress of Teams</h5>
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              margin: "0 auto",
                            }}
                          >
                            <CircularProgressbar
                              value={
                                Math.round((completedStep / totalStep) * 100) ||
                                0
                              }
                              text={`${
                                Math.round((completedStep / totalStep) * 100) ||
                                0
                              }%`}
                            />
                          </div>
                          <p>
                            <span>Average:</span> {completedStep} out of{" "}
                            {totalStep} steps complete
                          </p>
                        </div>
                      </Col>
                      <Col md={6} lg={6} xl={6}>
                        <div className={`${lx.prtGraph}`}>
                          <h5>% of Submissions Graded</h5>
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              margin: "0 auto",
                            }}
                          >
                            <CircularProgressbar
                              value={
                                Math.round(
                                  (feedbackDone / submittedAction) * 100
                                ) || 0
                              }
                              text={`${
                                Math.round(
                                  (feedbackDone / submittedAction) * 100
                                ) || 0
                              }%`}
                            />
                          </div>
                          <p>
                            <span>Average:</span> {feedbackDone} out of{" "}
                            {submittedAction} submissions graded
                          </p>
                        </div>
                      </Col>
                    </Row>

                    <Col lg={12} className="text-center">
                      <h5 className="mb-2 mt-3">
                        # of Teams Currently Participating
                      </h5>
                    </Col>

                    <div
                      className={`${lx.squareChart}`}
                      style={{
                        fontSize: "12px",
                        overflowY: "scroll",
                        height: "140px",
                      }}
                    >
                      <Chart perSimulationTeams={perSimulationTeams} />
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12} lg={4} xl={4}>
              <div className={`${lx.currentProgresstop}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3">Engagement of All Teams</h4>
                  <div
                    className={`${lx.graphInBody}`}
                    style={{ fontSize: "12px" }}
                  >
                    <Row>
                      <Col md={6} lg={6} xl={6}>
                        <div className={`${lx.prtGraph}`}>
                          <h5>Average Time Per Step</h5>
                          <p className={`${lx.engagementNumber}`}>
                            {+dateForStep[0] - 1970 > 0
                              ? `${+dateForStep[0] - 1970} Years`
                              : ""}{" "}
                            {+dateForStep[2] - 1 > 0
                              ? `${dateForStep[2]} Months`
                              : ""}{" "}
                            {+dateForStep[1] - 1 > 0
                              ? `${dateForStep[1]} Days`
                              : ""}{" "}
                            {timeForStep[0] != "00"
                              ? `${timeForStep[0]} Hours`
                              : ""}{" "}
                            {timeForStep[1] != "00"
                              ? `${timeForStep[1]} Minutes`
                              : ""}
                          </p>
                        </div>
                      </Col>
                      <Col md={6} lg={6} xl={6}>
                        <div className={`${lx.prtGraph}`}>
                          <h5>
                            Average Time Per <br />
                            Simulation
                          </h5>
                          <p className={`${lx.engagementNumber}`}>
                            {+dateForStepSimulation[0] - 1970 > 0
                              ? `${+dateForStepSimulation[0] - 1970} Years`
                              : ""}{" "}
                            {+dateForStepSimulation[2] - 1 > 0
                              ? `${dateForStepSimulation[2]} Months`
                              : ""}{" "}
                            {+dateForStepSimulation[1] - 1 > 0
                              ? `${dateForStepSimulation[1]} Days`
                              : ""}{" "}
                            {timeForStepSimulation[0] != "00"
                              ? `${timeForStepSimulation[0]} Hours`
                              : ""}{" "}
                            {timeForStepSimulation[1] != "00"
                              ? `${timeForStepSimulation[1]} Minutes`
                              : ""}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Col lg={12} className="text-center">
                      <h5 className="mb-2 mt-3">
                        Feedback Scores from Participants
                      </h5>
                    </Col>
                    <RectangleChart
                      studentRating={studentRating}
                      studentRatingLength={studentRatingLength}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12} lg={6} xl={6}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>Current Team Progress</h4>
                  <div className={`${lx.currentTeam}`}>
                    <p>Team</p>
                    <p>Progress</p>
                  </div>
                  {teamData?.map((item: any, index: number) => {
                    return (
                      <table onClick={() => onTeamRowClicked(item)}>
                        <tbody>
                          <tr>
                            <td>
                              <div
                                className={`${cx.cardImg} d-flex justify-content-center align-items-center`}
                                style={{
                                  cursor: "flex",
                                  border: "2px solid #009ce0",
                                  borderRadius: "50%",
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#009ce0",
                                }}
                              >
                                <span
                                  style={{ fontSize: "20px", color: "white" }}
                                >
                                  {item?.col2?.slice(0, 1).toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td>
                              <p className="ms-2 mb-0">{item?.col3}</p>
                            </td>
                            <td className={`${lx.currentPrecent}`}>
                              <ProgressBar now={item?.col5} />
                            </td>
                            <td>
                              <span className={`ms-2 `}>{item?.col5}%</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  })}
                </div>
              </div>
            </Col>
            <Col md={12} lg={6} xl={6}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>Submissions Pending Feedback</h4>
                  <p>
                    <select
                      name=""
                      id=""
                      onClick={(e: any) => setSelect(e.target.value)}
                    >
                      <option value="All Teams"> All Teams </option>
                      {teamData?.map((item: any, index: number) => {
                        return (
                          <>
                            <option value={item?.col3}> {item?.col3} </option>
                          </>
                        );
                      })}
                    </select>
                  </p>

                  <div className={`${lx.teamChart}`}>
                    <ul>
                      {value?.map((item: any, index: number) => {
                        let date = new Date(item.col5).toLocaleString("en-us", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return (
                          <li onClick={() => onRowClicked(item)}>
                            {item?.col4} - {item?.col3}
                            <span>{date}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default DashboardAdmin;
