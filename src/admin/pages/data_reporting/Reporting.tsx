import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./Reporting.module.scss";
// import { useState } from "react";
// import { AiOutlineCloudDownload } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import table from "../../../datatable.module.scss";
import DataTable, { Alignment } from "react-data-table-component";
import ProgressBar from "react-bootstrap/ProgressBar";
import Bar from "./BarChart";
import Chart from "./SquareChart";
import RectangleChart from "./RectangleChart";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch, FiUpload } from "react-icons/fi";
import { NavLink, useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-https";
import {
  changeModuleArrayValue,
  feedbackTeamName,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";

import {
  Card,
  Col,
  Dropdown,
  Row,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const percentage = 33;

const customStyles = {
  rows: {
    style: {
      minHeight: "55px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

const columns = [
  {
    name: "Participant Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Team Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Simulation Name",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "Step Name",
    selector: (row: any) => row.col4,
    sortable: true,
  },
  {
    name: "Criteria",
    selector: (row: any) => row.col5,
    sortable: true,
  },
  {
    name: "Score",
    selector: (row: any) => row.col6,
    sortable: true,
  },
  {
    name: "Qualitative Feedback",
    selector: (row: any) => row.col7,
    sortable: true,
  },
];

const columnsOne = [
  {
    name: "Team Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Simulation Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Progress %",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "# of steps completed",
    selector: (row: any) => row.col4,
    sortable: true,
  },
  {
    name: "# of total steps in simulation",
    selector: (row: any) => row.col5,
    sortable: true,
  },
];

const columnsTwo = [
  {
    name: "Team Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Simulation Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Submission Graded %",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "# of submissions graded",
    selector: (row: any) => row.col4,
    sortable: true,
  },
  {
    name: "# of total required submissions",
    selector: (row: any) => row.col5,
    sortable: true,
  },
];

const columnsThree = [
  {
    name: "Team Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Participants Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Simulation Name",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.col4,
    sortable: true,
  },
];

const columnsFour = [
  {
    name: "Team Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Participant Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Simulation Name",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "Step Name",
    selector: (row: any) => row.col4,
    sortable: true,
  },
  {
    name: "Work time for each step per participant",
    selector: (row: any) => row.col5,
    sortable: true,
  },
];

const columnsFive = [
  {
    name: "Team Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Participant Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Simulation Name",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "Work time for each simulation per participant",
    selector: (row: any) => row.col5,
    sortable: true,
  },
];

const columnsSix = [
  {
    name: "Simulation Name",
    selector: (row: any) => row.col1,
    sortable: true,
  },
  {
    name: "Participant Name",
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Effectiveness of Learning",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "Difficulty of Simulation",
    selector: (row: any) => row.col4,
    sortable: true,
  },
  {
    name: "Time to Complete",
    selector: (row: any) => row.col5,
    sortable: true,
  },
  {
    name: "Qualitative Comments",
    selector: (row: any) => row.col5,
    sortable: true,
  },
];

const ReportingAdmin = (props: any) => {
  const [filterText, setFilterText] = React.useState("");

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
  const [criteria, setCriteria] = useState<any[]>([]);
  const [studentRating, setStudentRating] = useState<any[]>([]);
  const [studentRatingLength, setStudentRatingLength] = useState<number>(0);
  const [cardName, setCardName] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [dataOne, setDataOne] = useState<any[]>([]);
  const [dataTwo, setDataTwo] = useState<any[]>([]);
  const [dataThree, setDataThree] = useState<any[]>([]);
  const [dataFour, setDataFour] = useState<any[]>([]);
  const [dataFive, setDataFive] = useState<any[]>([]);
  const [dataSix, setDataSix] = useState<any[]>([]);

  let itemThatInClick: any[] =
    cardName === "Participant Scoring on Submissions"
      ? data
      : cardName === "Average Progress of Teams"
      ? dataOne
      : cardName === "% of Submissions Graded"
      ? dataTwo
      : cardName === "# of Teams Currently Participating"
      ? dataThree
      : cardName === "Average Time Per Step"
      ? dataFour
      : cardName === "Average Time Per Simulation"
      ? dataFive
      : cardName === "Feedback Scores from Participants"
      ? dataSix
      : [];
  const filteredItems = itemThatInClick.filter(
    (item) =>
      item.col2 && item.col2.toLowerCase().includes(filterText.toLowerCase())
  );

  React.useEffect(() => {
    allTeam();
    getEvalution();
    getTime();
  }, []);

  const getTeam = (data: any) => {
    let completedStep = 0;
    let totalStep = 0;
    let completedAction = 0;
    let feedbackSubmittedCount = 0;
    let criteriaFeedbackArr: any[] = [];
    let stepData: any[] = [];
    let submissionData: any[] = [];
    let teamArr: any[] = [];
    let inCompleteSimulation: any[] = [];
    data?.data?.map((item: any, num: number) => {
      let amountOfSteps = 0;
      let amountOfCompletedStep = 0;
      let totalActionSubmission = 0;
      let feedbackCompleted = 0;
      let stepsArr: any[] = [];
      item?.Simulation?.AddallModule?.map((e: any) => {
        e?.addNewStepButtons[0]?.steps?.map((a: any, index: number) => {
          stepsArr.push(a);
          a?.actions?.map((z: any) => {
            if (
              z.actionValue == "Upload a File" ||
              z.actionValue == "Write an Email" ||
              z.actionValue == "Question and Answer" ||
              (z.actionValue == "Schedule a Live Conversation" &&
                z?.disable === 1)
            ) {
              completedAction += 1;
              totalActionSubmission += 1;
            }
            if (z.feedResourceByCoachCount === 1) {
              feedbackSubmittedCount += 1;
              feedbackCompleted += 1;
              z?.feedback?.map((s: any) => {
                criteriaFeedbackArr.push({
                  id: `${s.id}${Math.ceil((Math.random() * 100000000000) / 4)}`,
                  col1: z?.content?.studentName,
                  col2: item?.teamName,
                  col3: item?.Simulation?.NameOfSimulation,
                  col4: a?.title || a?.content,
                  col5: s?.title,
                  col6: s?.feedbackRating,
                  col7: s?.feedback,
                });
              });
            }
            if (submissionData.length > 0) {
              for (let i = 0; i < submissionData.length; i++) {
                if (submissionData.some((a: any) => a.id === item?._id)) {
                  submissionData?.map((s: any) => {
                    if (s.id === item?._id) {
                      s.col3 = `${Math.round(
                        (feedbackCompleted / totalActionSubmission) * 100
                      )}%`;
                      s.col4 = feedbackCompleted;
                      s.col5 = totalActionSubmission;
                    }
                  });
                } else {
                  submissionData.push({
                    id: item?._id,
                    col1: item?.teamName,
                    col2: item?.Simulation?.NameOfSimulation,
                    col3: `${Math.round(
                      (feedbackCompleted / totalActionSubmission) * 100
                    )}%`,
                    col4: feedbackCompleted,
                    col5: totalActionSubmission,
                  });
                }
              }
            } else {
              submissionData.push({
                id: item?._id,
                col1: item?.teamName,
                col2: item?.Simulation?.NameOfSimulation,
                col3: `${Math.round(
                  (feedbackCompleted / totalActionSubmission) * 100
                )}%`,
                col4: feedbackCompleted,
                col5: totalActionSubmission,
              });
            }
          });
          if (a?.apiButton === 1) {
            completedStep += 1;
            totalStep += 1;
            amountOfCompletedStep += 1;
            amountOfSteps += 1;
          } else {
            totalStep += 1;
            amountOfSteps += 1;
          }
          if (stepData.length > 0) {
            for (let i = 0; i < stepData.length; i++) {
              if (stepData.some((a: any) => a.id === item?._id)) {
                stepData?.map((s: any) => {
                  if (s.id === item?._id) {
                    s.col3 = `${Math.round(
                      (amountOfCompletedStep / amountOfSteps) * 100
                    )}%`;
                    s.col4 = amountOfCompletedStep;
                    s.col5 = amountOfSteps;
                  }
                });
              } else {
                stepData.push({
                  id: item?._id,
                  col1: item?.teamName,
                  col2: item?.Simulation?.NameOfSimulation,
                  col3: `${Math.round(
                    (amountOfCompletedStep / amountOfSteps) * 100
                  )}%`,
                  col4: amountOfCompletedStep,
                  col5: amountOfSteps,
                });
              }
            }
          } else {
            stepData.push({
              id: item?._id,
              col1: item?.teamName,
              col2: item?.Simulation?.NameOfSimulation,
              col3: `${Math.round(
                (amountOfCompletedStep / amountOfSteps) * 100
              )}%`,
              col4: amountOfCompletedStep,
              col5: amountOfSteps,
            });
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
      if (stepsArr.some((c: any) => c?.apiButton === 0)) {
        let fullName: any[] = [];
        item?.students?.map((f: any) => {
          fullName.push(`${f?.firstName} ${f?.lastName}`);
        });
        inCompleteSimulation.push({
          id: item?._id,
          col1: item?.teamName,
          col2: fullName.toString(),
          col3: item?.Simulation?.NameOfSimulation,
          col4: "In Progress",
        });
      } else {
        let fullName: any[] = [];
        item?.students?.map((f: any) => {
          fullName.push(`${f?.firstName} ${f?.lastName}`);
        });
        inCompleteSimulation.push({
          id: item?._id,
          col1: item?.teamName,
          col2: fullName.toString(),
          col3: item?.Simulation?.NameOfSimulation,
          col4: "Completed",
        });
      }
    });
    setTotalStep(totalStep);
    setCompletedStep(completedStep);
    setSubmittedAction(completedAction);
    setFeedbackDone(feedbackSubmittedCount);
    setPerSimulationTeams(teamArr);
    setData(criteriaFeedbackArr);
    setDataOne(stepData);
    setDataTwo(submissionData);
    setDataThree(inCompleteSimulation);
    const criteriaGraph: any[] = [];
    data?.data?.map((item: any) => {
      item?.Simulation?.AddallModule?.map((e: any) => {
        if (e?.addNewStepButtons) {
          e?.addNewStepButtons[0]?.steps?.map((a: any) => {
            a?.actions?.map((z: any, index: number) => {
              criteriaGraph.push(z?.feedback);
            });
          });
        }
      });
    });
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
    setDataFour(timePerParticipant);
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
    if (dataFour.length > 0) {
      let result: any[] = [];
      dataFour?.forEach((item: any) => {
        if (result.length > 0) {
          if (
            result.some(
              (a: any) =>
                a.col1 === item.col1 &&
                a.col2 === item.col2 &&
                a.col3 === item.col3
            )
          ) {
            for (let i = 0; i < result.length; i++) {
              if (
                result[i].col1 === item.col1 &&
                result[i].col2 === item.col2 &&
                result[i].col3 === item.col3
              ) {
                result[i].col4 = item.col4;
                result[i].col6 += item.col6;
                let check = new Date(result[i].col6).toISOString();
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
                result[i].col5 =
                  `${year} ${month} ${day} ${hour} ${minute}`.trim();
                break;
              }
            }
          } else {
            result.push({ ...item });
          }
        } else {
          result.push({ ...item });
        }
      });
      setDataFive(result);
    }
  }, [dataFour]);

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
    let allData: any[] = [];
    data?.data?.forEach((item: any, index: number) => {
      rateData[0].type += item?.type1;
      rateData[1].type += item?.type2;
      rateData[2].type += item?.type3;
      length = index + 1;
      allData.push({
        id: item?._id,
        col1: item?.simulationId?.NameOfSimulation,
        col2: item?.student_id?.firstName + " " + item?.student_id?.lastName,
        col3: item?.type1,
        col4: item?.type2,
        col5: item?.type3,
        col6: item?.discretionary,
      });
      setDataSix(allData);
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

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <div className={`${table.searchBox}`}>
          <FiSearch className={`${table.searchIcon}`} />
          <input
            className="form-control"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className={`${table.tableFilterIcons}`}>
          <NavLink to="#">
            <BiFilterAlt />
          </NavLink>
          <NavLink to="#">
            <FiUpload />
          </NavLink>
        </div>
      </>
    );
  }, [filterText]);

  return (
    <>
      <Header title="Data and Reporting" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title className="mt-4">Progress Report</Card.Title>
          <Row>
            <Col
              md={12}
              lg={4}
              xl={4}
              style={{ cursor: "pointer" }}
              onClick={() => setCardName("Participant Scoring on Submissions")}
            >
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3 ">Performance of All Teams</h4>
                  <Col lg={12} className="text-center">
                    <h5>Participant Scoring on Submissions</h5>
                  </Col>
                  <div
                    className={`${lx.squareChart} ${lx.onActiveClass} ${
                      cardName === "Participant Scoring on Submissions"
                        ? "active"
                        : ""
                    }`}
                  
                  >
                    <Bar criteria={criteria} />
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12} lg={4} xl={4}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3">Progress of Current Teams</h4>
                  <div className={`${lx.graphInBody}`}>
                    <Row>
                      <Col md={6} lg={6} xl={6}>
                        <div
                          className={`${lx.prtGraph} ${lx.onActiveClass} ${
                            cardName === "Average Progress of Teams"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setCardName("Average Progress of Teams")
                          }
                        >
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
                        <div
                          className={`${lx.prtGraph} ${lx.onActiveClass} ${
                            cardName === "% of Submissions Graded"
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setCardName("% of Submissions Graded")}
                        >
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

                    <div
                      className={`${lx.onActiveClass} mt-2 ${
                        cardName === "# of Teams Currently Participating"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setCardName("# of Teams Currently Participating")
                      }
                    >
                      <Col lg={12} className="text-center">
                        <h5 className="mb-2 mt-1">
                          # of Teams Currently Participating
                        </h5>
                      </Col>

                      <div
                        className={`${lx.squareChart}`}
                        style={{ fontSize: "12px", height: "140px" }}
                      >
                        <Chart perSimulationTeams={perSimulationTeams} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12} lg={4} xl={4}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 className="mb-3">Engagement of All Teams</h4>
                  <div
                    className={`${lx.graphInBody}`}
                    style={{ fontSize: "12px" }}
                  >
                    <Row>
                      <Col md={6} lg={6} xl={6}>
                        <div
                          className={`${lx.prtGraph} ${lx.onActiveClass} ${
                            cardName === "Average Time Per Step" ? "active" : ""
                          }`}
                          onClick={() => setCardName("Average Time Per Step")}
                        >
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
                        <div
                          className={`${lx.prtGraph} ${lx.onActiveClass} ${
                            cardName === "Average Time Per Simulation"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setCardName("Average Time Per Simulation")
                          }
                        >
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

                    <div
                      className={`${lx.onActiveClass} mt-2 ${
                        cardName === "Feedback Scores from Participants"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setCardName("Feedback Scores from Participants")
                      }
                    >
                      <Col lg={12} className="text-center">
                        <h5 className="mb-2 mt-1">
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
              </div>
            </Col>
          </Row>

          {cardName === "Participant Scoring on Submissions" ? (
            <Card.Title>Team Scoring on Submissions - Raw Data</Card.Title>
          ) : cardName === "Average Progress of Teams" ? (
            <Card.Title>
              Team Progress (Current Teams Only) - Raw Data
            </Card.Title>
          ) : cardName === "% of Submissions Graded" ? (
            <Card.Title>
              Submissions Graded (Current Teams Only) - Raw Data
            </Card.Title>
          ) : cardName === "# of Teams Currently Participating" ? (
            <Card.Title>Number of Participants/Teams - Raw Data</Card.Title>
          ) : cardName === "Average Time Per Step" ? (
            <Card.Title>Work Time to Complete(Step) - Raw Data</Card.Title>
          ) : cardName === "Average Time Per Simulation" ? (
            <Card.Title>
              Work Time to Complete(Simulation) - Raw Data
            </Card.Title>
          ) : cardName === "Feedback Scores from Participants" ? (
            <Card.Title>Feedback from Participants - Raw Data</Card.Title>
          ) : (
            ""
          )}

          <Card>
            {cardName === "" ? (
              <p>Double click any graph to see a detailed raw data report</p>
            ) : (
              <div className={`${table.dataTableBox}`}>
                <Card.Body>
                  <Box sx={{ width: 1 }}>
                    <DataTable
                      columns={
                        cardName === "Participant Scoring on Submissions"
                          ? columns
                          : cardName === "Average Progress of Teams"
                          ? columnsOne
                          : cardName === "% of Submissions Graded"
                          ? columnsTwo
                          : cardName === "# of Teams Currently Participating"
                          ? columnsThree
                          : cardName === "Average Time Per Step"
                          ? columnsFour
                          : cardName === "Average Time Per Simulation"
                          ? columnsFive
                          : columnsSix
                      }
                      data={filteredItems}
                      subHeader
                      subHeaderAlign={Alignment.LEFT}
                      persistTableHead
                      subHeaderComponent={subHeaderComponentMemo}
                      pagination
                      customStyles={customStyles}
                      //   expandableRows
                      //   expandableRowsComponent={ExpandedComponent}
                    />{" "}
                  </Box>
                </Card.Body>
              </div>
            )}
          </Card>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default ReportingAdmin;
