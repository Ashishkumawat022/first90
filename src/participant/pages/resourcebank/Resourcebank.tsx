import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../coach.style.module.scss";
import lx from "./Resourcebank.module.scss";

import lockImg from "../../../images/icon-lock.svg";
import lock from "../../../images/lock.svg";

import { NavLink, useHistory, useParams } from "react-router-dom";
import { Card, Col, Row, Form, OverlayTrigger } from "react-bootstrap";
import { FaAngleDown } from "react-icons/fa";
import useHttp from "../../../hooks/use-https";
import { useDispatch } from "react-redux";
import {
  changeModuleArrayValue,
  moduleArray,
  simulationIdGet,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";

const Resourcebank = (props: any) => {
  let loginData = localStorage.getItem("data")!;
  let localLoginData = JSON.parse(loginData)!;
  const [items, setItems] = useState<any[]>([]);
  const [globalResource, setGlobalResource] = useState<any>();
  const [additionalResource, setAdditionalResource] = useState<any>();
  const [stepResource, setStepResource] = useState<any[]>([]);
  const dispatch = useDispatch();
  const param: any = useParams();
  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    if (items?.length !== 0) setItems(moduleArray);
  }, [moduleArray]);

  const simulationResponse = (data: any) => {
    let moduleFull = data?.data[0]?.Simulation?.AddallModule;
    dispatch(changeModuleArrayValue(moduleFull));
    setItems(moduleFull);
    setGlobalResource(data?.data[0]?.Simulation?.globalResourceArray);
    setAdditionalResource(data?.data[0]?.Simulation?.additionalResource);
    const perActionData: any[] = [];
    moduleFull?.map((e: any) => {
      if (e?.addNewStepButtons) {
        e?.addNewStepButtons[0]?.steps?.map((a: any) => {
          perActionData.push({
            col1: e?.title || e?.content,
            col2: a?.title || a?.content,
            col3: a?.stepResources,
            col4: a?.disabled,
          });
        });
      }
    });
    setStepResource(perActionData);
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

  return (
    <>
      <Header title="Onboarding Simulation" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Row className="mb-4">
            <Col md={12} lg={12} xl={12} className="mb-4">
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4 style={{ color: "#191D23" }}>Instructions</h4>
                  <p>
                    Welcome to the Resource Bank! This is a convenient way for
                    you to access all the resources that you have seen during
                    your simulation up at this point.
                  </p>
                  <p>
                    There are two types of resources - global (resources that
                    apply to the whole simulation) and step specific (resource
                    that you may need at individual steps).
                  </p>
                  <p>
                    Every time you complete additional steps, the resources from
                    that step will be added here for your convenience.
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} lg={6} xl={6} className="mb-4">
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>Global Resources</h4>
                  <table className={`table ${lx.tableCts}`}>
                    <thead>
                      <tr>
                        <th>
                          Resource Name
                          {/* <FaAngleDown /> */}
                        </th>
                        <th>
                          Status
                          {/* <FaAngleDown /> */}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {globalResource?.map((item: any, index: number) => {
                        return item?.files?.map((e: any, num: number) => {
                          return (
                            <tr>
                              <td>
                                <span className={`${lx.themeColor}`}>
                                  <a
                                    href={e?.file}
                                    style={{ textDecoration: "none" }}
                                  >
                                    {item?.folderName
                                      ? `${item?.folderName} -`
                                      : ""}{" "}
                                    {e?.resourceTitle}
                                  </a>
                                </span>
                              </td>
                              <td>
                                <img src="../../../images/icon-lock.svg" />
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            <Col md={6} lg={6} xl={6} className="mb-4">
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>Additional Resources</h4>
                  <table className={`table ${lx.tableCts}`}>
                    <thead>
                      <tr>
                        <th>
                          Additional Resources
                          {/* <FaAngleDown /> */}
                        </th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalResource?.map((item: any, index: number) => {
                        return (
                          <tr>
                            <td>
                              <span className={`${lx.themeColor}`}>
                                <a
                                  href={item?.weblink}
                                  target="_blank"
                                  style={{ textDecoration: "none" }}
                                >
                                  {item?.title}
                                </a>
                              </span>
                            </td>
                            <td>{item?.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>

            <Col md={12} lg={12} xl={12} className="mb-4">
              <div className={`${lx.currentProgress}`}>
                <div className={`${lx.currentBox}`}>
                  <h4>Step Specific Resources</h4>
                  <table className={`table ${lx.tableCts}`}>
                    <thead>
                      <tr>
                        <th>
                          Resource Name
                          {/* <FaAngleDown /> */}
                        </th>
                        <th>
                          Module Name
                          {/* <FaAngleDown /> */}
                        </th>
                        <th>
                          Step Name
                          {/* <FaAngleDown /> */}
                        </th>
                        <th>
                          Status
                          {/* <FaAngleDown /> */}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stepResource?.map((item: any, index: number) => {
                        return item?.col3?.map((e: any, num: number) => {
                          return e?.files?.map((a: any, number: number) => {
                            return (
                              <tr>
                                <td>
                                  <span className={`${lx.themeColor}`}>
                                    {item?.col4 === false ? (
                                      <a
                                        href={a?.file}
                                        style={{
                                          textDecoration: "none",
                                          color: "#1D4ED8",
                                        }}
                                      >
                                        {" "}
                                        {e?.folderName
                                          ? `${e?.folderName} -`
                                          : ""}{" "}
                                        {a?.resourceTitle}{" "}
                                      </a>
                                    ) : (
                                      <>
                                        {e?.folderName
                                          ? `${e?.folderName} -`
                                          : ""}{" "}
                                        {a?.resourceTitle}{" "}
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td>{item?.col1}</td>
                                <td>{item?.col2}</td>
                                <td>
                                  <img
                                    src={item?.col4 === true ? lock : lockImg}
                                  />
                                </td>
                              </tr>
                            );
                          });
                        });
                      })}
                    </tbody>
                  </table>
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

export default Resourcebank;
