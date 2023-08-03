import React, { useState, useEffect } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../coach.style.module.scss";
import lx from "./Dashboard.module.scss";
import { FiPlusSquare } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import ProgressBar from "react-bootstrap/ProgressBar";

import { NavLink, useHistory } from "react-router-dom";
import { Card, Col, Row, Form, OverlayTrigger } from "react-bootstrap";
import useHttp from "../../../hooks/use-https";
import { changeModuleArrayValue, feedbackTeamName } from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";

const DashboardCoach = (props: any) => {
  const localData: any = localStorage.getItem("data");
  const parseData: any = JSON.parse(localData);
  const [value, setValue] = useState<any[]>([]);
  const [feedbackValue, setFeedbackValue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [select, setSelect] = useState("All Teams");
  const history = useHistory();
  const dispatch = useDispatch();
  const getTeam = (data: any) => {
    const perActionData: any[] = [];
    data?.map((item: any) => {
      item?.Simulation?.AddallModule?.map((e: any) => {
        if (e?.addNewStepButtons) {
          e?.addNewStepButtons[0]?.steps?.map((a: any) => {
            a?.actions?.map((z: any, index: number) => {
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
    setFeedbackValue(ascending)
    setValue(ascending);
    setLoading(false);
    const team: any[] = [];
    data?.map((item: any, index: number) => {
      let completedStep = 0;
      let totalStep = 0;
      item?.Simulation?.AddallModule?.map((e:any)=>{
        e?.addNewStepButtons[0]?.steps?.map((a:any)=>{
          if(a?.apiButton===1){
            completedStep += 1
            totalStep += 1
          }else{
            totalStep += 1
          }
        })
      })
      team.push({
        id: index,
        col1: `${index + 1}`,
        col2: item?.Simulation?.NameOfSimulation,
        col3: item?.teamName,
        col4: item?.students?.map(
          (party: any) => `${party.firstName} ${party.lastName}`
        ),
        col5: Math.round((completedStep/totalStep)*100),
        col6: item?.addSimulation,
      });
    });
    setTeamData(team);
    setTeamLoading(false);
  };
  useEffect(()=>{
    if(select!=="All Teams"){
      const data:any[] = [];
      feedbackValue?.map((item:any)=>{
       if(select===item?.col4){
         data.push(item)
       }
      })
      setValue(data)
    }else{
      setValue(feedbackValue)
    }
  },[select])
  const { isLoading, error, sendRequest } = useHttp();
  const allTeam = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/get_couch_team?couch=${parseData._id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeam
    );
  };
  useEffect(() => {
    allTeam();
  }, []);

  const onRowClicked = (row: any) => {
    history.push(`/coach/feedback-details/${row.col7}`);
    dispatch(changeModuleArrayValue(row.col8));
    dispatch(feedbackTeamName([row.col4, row.col9]))
    localStorage.setItem("teamId", JSON.stringify(row.col9));
  };
  const onTeamRowClicked = (row: any) => {
    history.push(`/coach/manage-team/${row.col6}`);
  };
  return (
    <>
      <Header title="Dashboard" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Row>
            <Col md={4} lg={4} xl={4}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to="/coach/account"
                  style={{ textDecoration: "none", color: "#126D4D" }}
                >
                  <h5>Edit My Info</h5>
                  <FiEdit2 className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={4} lg={4} xl={4}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to="/coach/team"
                  style={{ textDecoration: "none", color: "#126D4D" }}
                >
                  <h5>View My Teams</h5>
                  <FiUsers className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
            <Col md={4} lg={4} xl={4}>
              <div className={`${lx.cardBox}`}>
                <NavLink
                  to="/coach/feedback"
                  style={{ textDecoration: "none", color: "#126D4D" }}
                >
                  <h5>Provide Feedback</h5>
                  <FiPlusSquare className={`${lx.cardIcon}`} />
                </NavLink>
              </div>
            </Col>
          </Row>

          <Card.Title className="mt-4">Progress Report</Card.Title>
          <Row className="mb-4">
            <Col md={12} lg={6} xl={6}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>Current Team Progress</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Team</th>
                        <th>Members</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamData?.map((item: any, index: number) => {
                        return (
                          <tr onClick={()=>onTeamRowClicked(item)}>
                            <td>
                              <div className="d-flex align-items-center">
                              <div className={`${cx.cardImg} d-flex justify-content-center align-items-center`} style={{ cursor: "flex", border: "2px solid #009ce0", borderRadius: "50%", width: "40px", height: "40px", backgroundColor: "#009ce0" }}>
                              <span style={{ fontSize: "20px", color: "white" }}>{item?.col2?.slice(0, 1).toUpperCase()}</span>
                            </div>
                                <p className="ms-2 mb-0">{item?.col3}</p>
                              </div>
                            </td>
                            <td>{
                               item?.col4?.map((e:any,num:number)=>{
                                return e
                               }).join(",")
                              }</td>
                            <td className={`${lx.currentPrecent}`}>
                              <div className="d-flex align-items-center">
                                <ProgressBar now={item?.col5} />{" "}
                                <span className="ms-2">{item?.col5}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            <Col md={12} lg={6} xl={6}>
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>
                    Submissions Pending Feedback
                    <NavLink to="/coach/feedback" className={`${lx.link_btn}`}>
                      View details
                    </NavLink>
                  </h4>
                  <p>
                   <select name="" id="" onClick={(e:any)=>setSelect(e.target.value)}>
                   <option value="All Teams"> All Teams </option>
                    {
                      teamData?.map((item:any,index:number)=>{
                        return (
                          <>
                          <option value={item?.col3}> {item?.col3} </option>
                          </>
                        )
                      })
                    }
                   </select>
                  </p>

                  <div className={`${lx.teamChart}`}>
                    <ul>
                      {
                        value?.map((item:any, index:number)=>{
                          let date = new Date(item.col5).toLocaleString("en-us", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          return (
                            <li onClick={()=>onRowClicked(item)}>
                       {item?.col4} - {item?.col3}
                        <span>{date}</span>
                      </li>
                          )
                        })
                      }
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

export default DashboardCoach;
